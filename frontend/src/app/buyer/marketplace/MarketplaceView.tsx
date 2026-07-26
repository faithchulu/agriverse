"use client";

import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  HeartIcon as HeartOutline,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon } from "@heroicons/react/24/solid";
import { dummyMarketplaceListings } from "./dummy-data";
import type { LicenseType, MarketplaceListing } from "../../../types/MarketplaceListing";

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

const CROP_TYPES = [
  "All crops",
  ...Array.from(new Set(dummyMarketplaceListings.map((l) => l.cropType))),
];

type PurchaseState = "idle" | "buying" | "purchased";

export default function MarketplaceView() {
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

  const filtered = useMemo(() => {
    let items = dummyMarketplaceListings.filter((l) => {
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
        new Date(b.uploadedDate).getTime() -
        new Date(a.uploadedDate).getTime()
      );
    });

    return items;
  }, [query, cropFilter, licenseFilter, sort]);

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleBuy(id: string) {
    setPurchaseStates((prev) => ({ ...prev, [id]: "buying" }));

    // TODO: replace with `await axios.post(`/api/marketplace/listings/${id}/purchase`)`
    // once escrow/payment integration exists.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setPurchaseStates((prev) => ({ ...prev, [id]: "purchased" }));
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-[#8FBF9F]/30 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center dark:border-strokedark dark:bg-boxdark">
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
          {CROP_TYPES.map((c) => (
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
        {filtered.length} dataset{filtered.length !== 1 && "s"} available
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
            onBuy={() => handleBuy(listing.id)}
          />
        ))}

        {filtered.length === 0 && (
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
  onBuy,
}: {
  listing: MarketplaceListing;
  isSaved: boolean;
  onToggleSaved: () => void;
  purchaseState: PurchaseState;
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
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              LICENSE_STYLES[listing.licenseType]
            }`}
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
          ZMW {listing.price.toFixed(2)}
        </span>

        {purchaseState === "purchased" ? (
          <span className="flex items-center gap-1 text-sm font-medium text-[#2F5F3F]">
            <CheckCircleIcon className="h-4 w-4" />
            Purchased
          </span>
        ) : (
          <button
            onClick={onBuy}
            disabled={purchaseState === "buying"}
            className="rounded-md bg-[#2F5F3F] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#1B3A2B] disabled:opacity-60"
          >
            {purchaseState === "buying" ? "Processing…" : "Buy"}
          </button>
        )}
      </div>
    </div>
  );
}