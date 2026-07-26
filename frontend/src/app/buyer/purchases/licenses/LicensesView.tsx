"use client";

import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { dummyLicenses } from "./dummy-data";
import type { License, LicenseKind, LicenseState } from "../../../../types/Licensing";

const KIND_LABEL: Record<LicenseKind, string> = {
  "one-time": "One-time download",
  "time-limited": "Time-limited access",
  "research-only": "Research use only",
};

const KIND_STYLES: Record<LicenseKind, string> = {
  "one-time": "bg-[#EAF3DE] text-[#2F5F3F]",
  "time-limited": "bg-[#FAEEDA] text-[#854F0B]",
  "research-only": "bg-[#E6F1FB] text-[#0C447C]",
};

const STATE_STYLES: Record<LicenseState, string> = {
  active: "bg-[#EAF3DE] text-[#2F5F3F]",
  expired: "bg-[#3B2F22]/10 text-[#3B2F22]",
  used: "bg-[#E6F1FB] text-[#0C447C]",
};

const TABS: { label: string; value: LicenseState | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Used", value: "used" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default function LicensesView() {
  const [tab, setTab] = useState<LicenseState | "all">("all");
  const [query, setQuery] = useState("");
  const [renewalRequested, setRenewalRequested] = useState<Set<string>>(
    new Set(),
  );

  const filtered = useMemo(() => {
    return dummyLicenses.filter((l) => {
      const matchesTab = tab === "all" || l.state === tab;
      const matchesQuery =
        query.trim() === "" ||
        l.datasetTitle.toLowerCase().includes(query.toLowerCase()) ||
        l.sellerName.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  function requestRenewal(id: string) {
    // TODO: replace with `await axios.post(`/api/buyer/licenses/${id}/renew`)`
    setRenewalRequested((prev) => new Set(prev).add(id));
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
            placeholder="Search dataset or seller"
            className="w-full rounded-md border border-[#3B2F22]/20 py-2 pl-9 pr-3 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>
      </div>

      <ul className="divide-y divide-[#3B2F22]/5 dark:divide-strokedark">
        {filtered.map((license) => (
          <LicenseRow
            key={license.id}
            license={license}
            renewalRequested={renewalRequested.has(license.id)}
            onRequestRenewal={() => requestRenewal(license.id)}
          />
        ))}

        {filtered.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-[#3B2F22]/50 dark:text-bodydark2">
            No licenses match this filter.
          </li>
        )}
      </ul>
    </div>
  );
}

function LicenseRow({
  license,
  renewalRequested,
  onRequestRenewal,
}: {
  license: License;
  renewalRequested: boolean;
  onRequestRenewal: () => void;
}) {
  const now = new Date();
  const expiry = license.expiryDate ? new Date(license.expiryDate) : null;
  const granted = new Date(license.grantedDate);

  const daysLeft = expiry ? daysBetween(now, expiry) : null;
  const totalSpan = expiry ? daysBetween(granted, expiry) : null;
  const elapsedPct =
    expiry && totalSpan
      ? Math.min(
          100,
          Math.max(0, (daysBetween(granted, now) / totalSpan) * 100),
        )
      : null;

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-[#1B3A2B] dark:text-white">
            {license.datasetTitle}
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              KIND_STYLES[license.licenseKind]
            }`}
          >
            {KIND_LABEL[license.licenseKind]}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
              STATE_STYLES[license.state]
            }`}
          >
            {license.state}
          </span>
        </div>
        <p className="mt-1 text-xs text-[#3B2F22]/50 dark:text-bodydark2">
          {license.sellerName} · Granted {formatDate(license.grantedDate)}
          {expiry && ` · Expires ${formatDate(license.expiryDate!)}`}
        </p>

        {license.state === "active" && expiry && elapsedPct !== null && (
          <div className="mt-2 max-w-xs">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#3B2F22]/10">
              <div
                className="h-full rounded-full bg-[#D9A441]"
                style={{ width: `${elapsedPct}%` }}
              />
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-[#3B2F22]/50 dark:text-bodydark2">
              <ClockIcon className="h-3 w-3" />
              {daysLeft !== null && daysLeft > 0
                ? `${daysLeft} days left`
                : "Expires today"}
            </p>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {license.state !== "expired" && (
          <button
            title="Download will be available once storage integration is live"
            disabled
            className="flex cursor-not-allowed items-center gap-1.5 rounded-md border border-[#3B2F22]/15 px-3 py-1.5 text-xs font-medium text-[#3B2F22]/40"
          >
            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            Download
          </button>
        )}

        {license.state === "expired" &&
          (renewalRequested ? (
            <span className="text-xs font-medium text-[#2F5F3F]">
              Renewal requested
            </span>
          ) : (
            <button
              onClick={onRequestRenewal}
              className="rounded-md bg-[#2F5F3F] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1B3A2B]"
            >
              Request renewal
            </button>
          ))}
      </div>
    </li>
  );
}