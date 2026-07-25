"use client";

import { useMemo, useState } from "react";
import {
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { dummyPayouts, initialAvailableBalance } from "./dummy-data";
import type { Payout, PayoutStatus } from "../../../../types/Payout";

const STATUS_STYLES: Record<PayoutStatus, string> = {
  pending: "bg-[#FAEEDA] text-[#854F0B]",
  completed: "bg-[#EAF3DE] text-[#2F5F3F]",
  failed: "bg-[#FCEBEB] text-[#A32D2D]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BanknotesIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF3DE]">
        <Icon className="h-5 w-5 text-[#2F5F3F]" />
      </div>
      <div>
        <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
          {label}
        </p>
        <p className="text-lg font-semibold text-[#1B3A2B] dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function PayoutsView() {
  const [payouts, setPayouts] = useState<Payout[]>(dummyPayouts);
  const [availableBalance, setAvailableBalance] = useState(
    initialAvailableBalance,
  );
  const [isRequesting, setIsRequesting] = useState(false);

  const totalPaidOut = useMemo(
    () =>
      payouts
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0),
    [payouts],
  );

  const pendingAmount = useMemo(
    () =>
      payouts
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0),
    [payouts],
  );

  async function handleRequestPayout() {
    if (availableBalance <= 0 || isRequesting) return;
    setIsRequesting(true);

    // TODO: replace with `await axios.post("/api/farmer/payouts", { amount: availableBalance })`
    // once a real wallet/bank payout integration exists.
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newPayout: Payout = {
      id: `pyt_${Date.now()}`,
      date: new Date().toISOString(),
      amount: availableBalance,
      method: "Bank transfer",
      status: "pending",
      reference: `REF-${Math.floor(Math.random() * 90000 + 10000)}`,
    };

    setPayouts((prev) => [newPayout, ...prev]);
    setAvailableBalance(0);
    setIsRequesting(false);
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={BanknotesIcon}
          label="Available balance"
          value={`$${availableBalance.toFixed(2)}`}
        />
        <SummaryCard
          icon={ClockIcon}
          label="Pending payout"
          value={`$${pendingAmount.toFixed(2)}`}
        />
        <SummaryCard
          icon={CheckCircleIcon}
          label="Total paid out"
          value={`$${totalPaidOut.toFixed(2)}`}
        />
      </div>

      {/* Request payout */}
      <div className="flex items-center justify-between rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <div>
          <p className="font-medium text-[#1B3A2B] dark:text-white">
            Request a payout
          </p>
          <p className="text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            {availableBalance > 0
              ? `$${availableBalance.toFixed(2)} is ready to withdraw.`
              : "No available balance to withdraw right now."}
          </p>
        </div>
        <button
          onClick={handleRequestPayout}
          disabled={availableBalance <= 0 || isRequesting}
          className="rounded-md bg-[#2F5F3F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B3A2B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRequesting ? "Requesting…" : "Request payout"}
        </button>
      </div>

      {/* History */}
      <div className="rounded-lg border border-[#8FBF9F]/30 bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-[#3B2F22]/10 p-4 dark:border-strokedark">
          <h2 className="text-sm font-semibold text-[#1B3A2B] dark:text-white">
            Payout history
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3B2F22]/10 text-xs uppercase tracking-wide text-[#3B2F22]/50 dark:border-strokedark dark:text-bodydark2">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#3B2F22]/5 last:border-0 dark:border-strokedark"
                >
                  <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                    {formatDate(p.date)}
                  </td>
                  <td className="px-4 py-3 text-[#1B3A2B] dark:text-white">
                    ${p.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                    {p.method}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        STATUS_STYLES[p.status]
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#3B2F22]/50 dark:text-bodydark2">
                    {p.reference}
                  </td>
                </tr>
              ))}

              {payouts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-[#3B2F22]/50 dark:text-bodydark2"
                  >
                    No payouts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}