"use client";

import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  NoSymbolIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { dummyListings } from "./dummy-data";
import type { Listing, ListingStatus } from "../../../../types/Listing";

const TABS: { label: string; value: ListingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Live", value: "live" },
  { label: "Sold", value: "sold" },
  { label: "Withdrawn", value: "withdrawn" },
];

const STATUS_STYLES: Record<ListingStatus, string> = {
  draft: "bg-[#3B2F22]/10 text-[#3B2F22]",
  live: "bg-[#EAF3DE] text-[#2F5F3F]",
  sold: "bg-[#FAEEDA] text-[#854F0B]",
  withdrawn: "bg-[#FCEBEB] text-[#A32D2D]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ListingsTable() {
  const [listings, setListings] = useState<Listing[]>(dummyListings);
  const [tab, setTab] = useState<ListingStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesTab = tab === "all" || l.status === tab;
      const matchesQuery =
        query.trim() === "" ||
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.cropType.toLowerCase().includes(query.toLowerCase()) ||
        l.region.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [listings, tab, query]);

  function withdrawListing(id: string) {
    // TODO: replace with `await axios.patch(`/api/farmer/listings/${id}`, { status: "withdrawn" })`
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "withdrawn" } : l)),
    );
  }

  return (
    <div className="rounded-lg border border-[#8FBF9F]/30 bg-white dark:border-strokedark dark:bg-boxdark">
      {/* Tabs + search */}
      <div className="flex flex-col gap-4 border-b border-[#3B2F22]/10 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-strokedark">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.value
                  ? "bg-[#2F5F3F] text-white"
                  : "text-[#3B2F22]/60 hover:bg-[#EAF3DE] dark:text-bodydark2"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B2F22]/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings"
            className="w-full rounded-md border border-[#3B2F22]/20 py-2 pl-9 pr-3 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#3B2F22]/10 text-xs uppercase tracking-wide text-[#3B2F22]/50 dark:border-strokedark dark:text-bodydark2">
              <th className="px-4 py-3 font-medium">Dataset</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Uploaded</th>
              <th className="px-4 py-3 font-medium">Interest</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((listing) => (
              <tr
                key={listing.id}
                className="border-b border-[#3B2F22]/5 last:border-0 dark:border-strokedark"
              >
                <td className="max-w-xs px-4 py-3">
                  <p className="font-medium text-[#1B3A2B] dark:text-white">
                    {listing.title}
                  </p>
                  <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
                    {listing.cropType}
                  </p>
                </td>
                <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                  {listing.region}
                </td>
                <td className="px-4 py-3 text-[#1B3A2B] dark:text-white">
                  ZMW {listing.price.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[listing.status]
                    }`}
                  >
                    {listing.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                  {formatDate(listing.uploadedDate)}
                </td>
                <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                  {listing.buyersInterested}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {(listing.status === "draft" ||
                      listing.status === "live") && (
                      <button
                        title="Edit listing"
                        className="rounded-md p-1.5 text-[#3B2F22]/60 hover:bg-[#EAF3DE] hover:text-[#2F5F3F]"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    )}
                    {listing.status === "live" && (
                      <button
                        title="Withdraw listing"
                        onClick={() => withdrawListing(listing.id)}
                        className="rounded-md p-1.5 text-[#3B2F22]/60 hover:bg-[#FCEBEB] hover:text-[#A32D2D]"
                      >
                        <NoSymbolIcon className="h-4 w-4" />
                      </button>
                    )}
                    {(listing.status === "sold" ||
                      listing.status === "withdrawn") && (
                      <button
                        title="View listing"
                        className="rounded-md p-1.5 text-[#3B2F22]/60 hover:bg-[#EAF3DE] hover:text-[#2F5F3F]"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-[#3B2F22]/50 dark:text-bodydark2"
                >
                  No listings match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}