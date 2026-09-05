"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  paymentsApi,
  type Transaction as ApiTransaction,
} from "../../../lib/api/payments";
import { extractErrorMessage } from "../../../lib/api/types";
import type { TransactionStatus } from "../../../types/BuyerTransaction";

type TransactionFilter =
  | "all"
  | "pending"
  | "completed"
  | "disputed"
  | "refunded";

const TABS: { label: string; value: TransactionFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
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

const LICENSE_LABEL: Record<string, string> = {
  "one-time": "One-time download",
  "time-limited": "Time-limited access",
  "research-only": "Research use only",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number) {
  return `ZMW ${amount.toFixed(2)}`;
}

export default function TransactionsView() {
  const [transactions, setTransactions] = useState<ApiTransaction[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TransactionFilter>("all");
  const [query, setQuery] = useState("");
  const [disputingId, setDisputingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await paymentsApi.myTransactions();
        if (cancelled) return;
        setTransactions(data);
      } catch (err) {
        if (cancelled) return;
        setError(extractErrorMessage(err));
        setTransactions((prev) => prev ?? []);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const matchesTab =
        tab === "all" ||
        (tab === "pending" &&
          (t.status === "pending" || t.status === "paid")) ||
        (tab === "completed" && t.status === "released") ||
        t.status === tab;
      const matchesQuery =
        query.trim() === "" ||
        (t.sellerName ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (t.datasetTitle ?? "").toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [transactions, tab, query]);

  const totalSpent = useMemo(
    () => filtered.reduce((sum, t) => sum + t.amount, 0),
    [filtered],
  );

  async function raiseDispute(id: string) {
    const reason = window.prompt("What is the reason for this dispute?");
    if (!reason || !reason.trim()) return;

    setDisputingId(id);
    try {
      await paymentsApi.dispute(id, reason.trim());
      setTransactions((prev) =>
        prev
          ? prev.map((t) => (t.id === id ? { ...t, status: "disputed" } : t))
          : prev,
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setDisputingId(null);
    }
  }

  return (
    <div className="rounded-lg border border-[#8FBF9F]/30 bg-white dark:border-strokedark dark:bg-boxdark">
      {error && (
        <div className="border-b border-[#A32D2D]/30 bg-[#FCEBEB] px-4 py-3 text-sm text-[#A32D2D]">
          {error}
        </div>
      )}

      {/* Tabs + search */}
      <div className="flex flex-col gap-4 border-b border-[#3B2F22]/10 p-4 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between">
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
        {transactions === null
          ? "Loading transactions..."
          : `${filtered.length} transaction${filtered.length !== 1 ? "s" : ""} · ${formatAmount(totalSpent)} spent`}
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
              <th className="px-4 py-3 text-right font-medium">Actions</th>
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
                  {t.sellerName ?? "Unknown seller"}
                </td>
                <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                  {LICENSE_LABEL[t.licenseType] ?? t.licenseType}
                </td>
                <td className="px-4 py-3 text-[#1B3A2B] dark:text-white">
                  {formatAmount(t.amount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[t.status as TransactionStatus] ??
                      "bg-[#3B2F22]/10 text-[#3B2F22]"
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
                        disabled={disputingId === t.id}
                        onClick={() => raiseDispute(t.id)}
                        className="rounded-md p-1.5 text-[#3B2F22]/60 hover:bg-[#FCEBEB] hover:text-[#A32D2D] disabled:opacity-50"
                      >
                        <ExclamationTriangleIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {transactions !== null && filtered.length === 0 && (
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
