"use client";

import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { dummyPurchases } from "./dummy-data";
import type { Purchase, PurchaseStatus } from "../../../../types/Purchase";

const STATUS_STYLES: Record<PurchaseStatus, string> = {
  completed: "bg-[#EAF3DE] text-[#2F5F3F]",
  refunded: "bg-[#3B2F22]/10 text-[#3B2F22]",
};

type SortOption = "newest" | "oldest" | "price-desc";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PurchaseHistoryView() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let items = dummyPurchases.filter(
      (p) =>
        query.trim() === "" ||
        p.datasetTitle.toLowerCase().includes(query.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(query.toLowerCase()),
    );

    items = [...items].sort((a, b) => {
      if (sort === "price-desc") return b.price - a.price;
      const diff =
        new Date(b.purchaseDate).getTime() -
        new Date(a.purchaseDate).getTime();
      return sort === "oldest" ? -diff : diff;
    });

    return items;
  }, [query, sort]);

  const totalSpent = useMemo(
    () =>
      dummyPurchases
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.price, 0),
    [],
  );

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
          Total spent to date
        </p>
        <p className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
          ZMW {totalSpent.toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg border border-[#8FBF9F]/30 bg-white dark:border-strokedark dark:bg-boxdark">
        {/* Search + sort */}
        <div className="flex flex-col gap-3 border-b border-[#3B2F22]/10 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-strokedark">
          <div className="relative sm:w-64">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B2F22]/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dataset or seller"
              className="w-full rounded-md border border-[#3B2F22]/20 py-2 pl-9 pr-3 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-md border border-[#3B2F22]/20 px-3 py-2 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="price-desc">Highest price</option>
          </select>
        </div>

        {/* List */}
        <ul className="divide-y divide-[#3B2F22]/5 dark:divide-strokedark">
          {filtered.map((purchase) => (
            <PurchaseRow key={purchase.id} purchase={purchase} />
          ))}

          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-[#3B2F22]/50 dark:text-bodydark2">
              No purchases match your search.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function PurchaseRow({ purchase }: { purchase: Purchase }) {
  return (
    <li className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#1B3A2B] dark:text-white">
          {purchase.datasetTitle}
        </p>
        <p className="mt-0.5 text-xs text-[#3B2F22]/50 dark:text-bodydark2">
          {purchase.sellerName} · {purchase.licenseType} ·{" "}
          {formatDate(purchase.purchaseDate)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            STATUS_STYLES[purchase.status]
          }`}
        >
          {purchase.status}
        </span>
        <span className="w-16 text-right text-sm font-semibold text-[#1B3A2B] dark:text-white">
          ZMW {purchase.price.toFixed(2)}
        </span>
        <button
          title="Receipt download will be available once billing integration is live"
          disabled
          className="cursor-not-allowed rounded-md p-1.5 text-[#3B2F22]/30"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}