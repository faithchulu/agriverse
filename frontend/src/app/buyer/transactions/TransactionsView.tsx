"use client";

import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { dummyTransactions } from "./dummy-data";
import type { Transaction, TransactionStatus } from "../../../types/BuyerTransaction";

const TABS: { label: string; value: TransactionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Released", value: "released" },
  { label: "Disputed", value: "disputed" },
  { label: "Refunded", value: "refunded" },
];

const STATUS_STYLES: Record<TransactionStatus, string> = {
  pending: "bg-[#FAEEDA] text-[#854F0B]",
  paid: "bg-[#E6F1FB] text-[#0C447C]",
  released: "bg-[#EAF3DE] text-[#2F5F3F]",
  disputed: "bg-[#FCEBEB] text-[#A32D2D]",
  refunded: "bg-[#3B2F22]/10 text-[#3B2F22]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TransactionsView() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(dummyTransactions);
  const [tab, setTab] = useState<TransactionStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesTab = tab === "all" || t.status === tab;
      const matchesQuery =
        query.trim() === "" ||
        t.sellerName.toLowerCase().includes(query.toLowerCase()) ||
        t.datasetTitle.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [transactions, tab, query]);

  const totalSpent = useMemo(
    () => filtered.reduce((sum, t) => sum + t.amount, 0),
    [filtered],
  );

  function raiseDispute(id: string) {
    // TODO: replace with `await axios.post(`/api/buyer/transactions/${id}/dispute`, { reason })`
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "disputed" } : t)),
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
            placeholder="Search seller or dataset"
            className="w-full rounded-md border border-[#3B2F22]/20 py-2 pl-9 pr-3 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>
      </div>

      <div className="border-b border-[#3B2F22]/10 px-4 py-2.5 text-xs text-[#3B2F22]/50 dark:border-strokedark dark:text-bodydark2">
        {filtered.length} transaction{filtered.length !== 1 && "s"} · $
        {totalSpent.toFixed(2)} spent
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#3B2F22]/10 text-xs uppercase tracking-wide text-[#3B2F22]/50 dark:border-strokedark dark:text-bodydark2">
              <th className="px-4 py-3 font-medium">Dataset</th>
              <th className="px-4 py-3 font-medium">Seller</th>
              <th className="px-4 py-3 font-medium">License</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="border-b border-[#3B2F22]/5 last:border-0 dark:border-strokedark"
              >
                <td className="max-w-xs px-4 py-3 font-medium text-[#1B3A2B] dark:text-white">
                  {t.datasetTitle}
                </td>
                <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                  {t.sellerName}
                </td>
                <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                  {t.licenseType}
                </td>
                <td className="px-4 py-3 text-[#1B3A2B] dark:text-white">
                  ZMW {t.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[t.status]
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                  {formatDate(t.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {t.status === "released" && (
                      <button
                        title="Download will be available once storage integration is live"
                        disabled
                        className="cursor-not-allowed rounded-md p-1.5 text-[#3B2F22]/30"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    )}
                    {(t.status === "paid" || t.status === "released") && (
                      <button
                        title="Raise a dispute"
                        onClick={() => raiseDispute(t.id)}
                        className="rounded-md p-1.5 text-[#3B2F22]/60 hover:bg-[#FCEBEB] hover:text-[#A32D2D]"
                      >
                        <ExclamationTriangleIcon className="h-4 w-4" />
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
                  No transactions match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}