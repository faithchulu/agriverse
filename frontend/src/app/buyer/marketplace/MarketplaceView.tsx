"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  HeartIcon as HeartOutline,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon } from "@heroicons/react/24/solid";
import type { LicenseType } from "../../../types/Licensing";
import {
  marketplaceApi,
  type ApiMarketplaceListing,
} from "../../../lib/api/marketplace";
import { paymentsApi } from "../../../lib/api/payments";
import { extractErrorMessage } from "../../../lib/api/types";

const LICENSE_LABEL: Record<LicenseType, string> = {
  "one-time": "One-time download",
  "time-limited": "Time-limited access",
  "research-only": "Research use only",
};

const LICENSE_STYLES: Record<LicenseType, string> = {
  "one-time": "bg-[#EAF3DE] text-[#2F5F3F]",
  "time-limited": "bg-[#FAEEDA] text-[#854F0B]",
  "research-only": "bg-[#E6F1FB] text-[#0C447C]",
};

type SortOption = "newest" | "price-asc" | "price-desc";
type PurchaseState = "idle" | "buying" | "purchased" | "error";

export default function MarketplaceView() {
  const [listings, setListings] = useState<ApiMarketplaceListing[] | null>(
    null,
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [cropFilter, setCropFilter] = useState("All crops");
  const [licenseFilter, setLicenseFilter] = useState<"all" | LicenseType>(
    "all",
  );
  const [sort, setSort] = useState<SortOption>("newest");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [purchaseStates, setPurchaseStates] = useState<
    Record<string, PurchaseState>
  >({});
  const [purchaseErrors, setPurchaseErrors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;
    marketplaceApi
      .browse({ limit: 50 })
      .then((res) => {
        if (!cancelled) setListings(res.items);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(extractErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cropTypes = useMemo(() => {
    if (!listings) return ["All crops"];
    return [
      "All crops",
      ...Array.from(new Set(listings.map((l) => l.cropType))),
    ];
  }, [listings]);

  const filtered = useMemo(() => {
    if (!listings) return [];

    let items = listings.filter((l) => {
      const matchesQuery =
        query.trim() === "" ||
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.region.toLowerCase().includes(query.toLowerCase()) ||
        l.sellerName.toLowerCase().includes(query.toLowerCase());
      const matchesCrop =
        cropFilter === "All crops" || l.cropType === cropFilter;
      const matchesLicense =
        licenseFilter === "all" || l.licenseType === licenseFilter;
      return matchesQuery && matchesCrop && matchesLicense;
    });

    items = [...items].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return (
        new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime()
      );
    });

    return items;
  }, [listings, query, cropFilter, licenseFilter, sort]);

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Chains three real backend calls (purchase → pay → release) so one
  // "Buy" click produces a fully completed sale with an active license,
  // matching what the UI has always promised. Known limitation: purchase
  // reserves the dataset (flips it to SOLD) immediately — if `pay` or
  // `release` fails partway through, the dataset stays reserved and the
  // transaction sits at PENDING/PAID rather than rolling back. Fine for
  // a demo; a production version would want this as one atomic backend
  // operation, or a "resume" affordance for stuck transactions.
  async function handleBuy(datasetId: string) {
    setPurchaseStates((prev) => ({ ...prev, [datasetId]: "buying" }));
    setPurchaseErrors((prev) => {
      const next = { ...prev };
      delete next[datasetId];
      return next;
    });

    try {
      const transaction = await paymentsApi.purchase(datasetId);
      await paymentsApi.pay(transaction.id);
      await paymentsApi.release(transaction.id);
      setPurchaseStates((prev) => ({ ...prev, [datasetId]: "purchased" }));
    } catch (err) {
      setPurchaseStates((prev) => ({ ...prev, [datasetId]: "error" }));
      setPurchaseErrors((prev) => ({
        ...prev,
        [datasetId]: extractErrorMessage(err),
      }));
    }
  }

  if (loadError) {
    return (
      <div className="rounded-md border border-[#A32D2D]/30 bg-[#FCEBEB] px-4 py-3 text-sm text-[#A32D2D]">
        Could not load the marketplace: {loadError}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:min-w-[220px]">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B2F22]/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search datasets, region, seller"
            className="w-full rounded-md border border-[#3B2F22]/20 py-2 pl-9 pr-3 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="rounded-md border border-[#3B2F22]/20 px-3 py-2 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
        >
          {cropTypes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={licenseFilter}
          onChange={(e) =>
            setLicenseFilter(e.target.value as "all" | LicenseType)
          }
          className="rounded-md border border-[#3B2F22]/20 px-3 py-2 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
        >
          <option value="all">All license types</option>
          <option value="one-time">One-time download</option>
          <option value="time-limited">Time-limited access</option>
          <option value="research-only">Research use only</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-md border border-[#3B2F22]/20 px-3 py-2 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
        {listings === null
          ? "Loading…"
          : `${filtered.length} dataset${filtered.length !== 1 ? "s" : ""} available`}
      </p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isSaved={saved.has(listing.id)}
            onToggleSaved={() => toggleSaved(listing.id)}
            purchaseState={purchaseStates[listing.id] ?? "idle"}
            purchased={listing.purchased}
            purchaseError={purchaseErrors[listing.id]}
            onBuy={() => handleBuy(listing.id)}
          />
        ))}

        {listings !== null && filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-[#3B2F22]/50 dark:text-bodydark2">
            No datasets match your filters.
          </p>
        )}
      </div>
    </div>
  );
}

function ListingCard({
  listing,
  isSaved,
  onToggleSaved,
  purchaseState,
  purchased,
  purchaseError,
  onBuy,
}: {
  listing: ApiMarketplaceListing;
  isSaved: boolean;
  onToggleSaved: () => void;
  purchaseState: PurchaseState;
  purchased: boolean;
  purchaseError?: string;
  onBuy: () => void;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#EAF3DE] px-2.5 py-1 text-xs font-medium text-[#2F5F3F]">
            {listing.cropType}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${LICENSE_STYLES[listing.licenseType]}`}
          >
            {LICENSE_LABEL[listing.licenseType]}
          </span>
        </div>
        <button
          onClick={onToggleSaved}
          aria-label={isSaved ? "Remove from saved" : "Save listing"}
          className="shrink-0 text-[#D9A441]"
        >
          {isSaved ? (
            <HeartSolid className="h-5 w-5" />
          ) : (
            <HeartOutline className="h-5 w-5 text-[#3B2F22]/40" />
          )}
        </button>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug text-[#1B3A2B] dark:text-white">
        {listing.title}
      </h3>
      <p className="mt-1 text-xs text-[#3B2F22]/50 dark:text-bodydark2">
        {listing.region}
      </p>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#3B2F22]/60 dark:text-bodydark2">
        <StarIcon className="h-3.5 w-3.5 text-[#D9A441]" />
        {listing.sellerRating.toFixed(1)} · {listing.sellerName}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#3B2F22]/10 pt-3 dark:border-strokedark">
        <span className="text-lg font-semibold text-[#1B3A2B] dark:text-white">
          ${listing.price.toFixed(2)}
        </span>

        {purchased || purchaseState === "purchased" ? (
          <span className="flex items-center gap-1 text-sm font-medium text-[#2F5F3F]">
            <CheckCircleIcon className="h-4 w-4" />
            Purchased
          </span>
        ) : (
          <button
            onClick={onBuy}
            disabled={purchased || purchaseState === "buying"}
            className="rounded-md bg-[#2F5F3F] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#1B3A2B] disabled:opacity-60"
          >
            {purchaseState === "buying"
              ? "Processing…"
              : purchaseState === "error"
                ? "Try again"
                : "Buy"}
          </button>
        )}
      </div>

      {purchaseState === "error" && purchaseError && (
        <p className="mt-2 text-xs text-[#A32D2D]">{purchaseError}</p>
      )}
    </div>
  );
}
