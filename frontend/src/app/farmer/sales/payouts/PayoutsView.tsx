"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { paymentsApi, type Payout } from "../../../../lib/api/payments";
import { extractErrorMessage } from "../../../../lib/api/types";
import type { PayoutStatus } from "../../../../types/Payout";

const STATUS_STYLES: Record<PayoutStatus, string> = {
  pending: "bg-[#FAEEDA] text-[#854F0B]",
  completed: "bg-[#EAF3DE] text-[#2F5F3F]",
  failed: "bg-[#FCEBEB] text-[#A32D2D]",
};

const PAYOUT_METHOD = "Bank transfer";

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
  const [payouts, setPayouts] = useState<Payout[] | null>(null);
  const [availableBalance, setAvailableBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [balanceRes, payoutsRes] = await Promise.all([
          paymentsApi.payoutBalance(),
          paymentsApi.myPayouts(),
        ]);
        if (cancelled) return;
        setAvailableBalance(balanceRes.availableBalance);
        setPayouts(payoutsRes);
      } catch (err) {
        if (cancelled) return;
        setError(extractErrorMessage(err));
        setAvailableBalance((prev) => prev ?? 0);
        setPayouts((prev) => prev ?? []);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPaidOut = useMemo(
    () =>
      (payouts ?? [])
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0),
    [payouts],
  );

  const pendingAmount = useMemo(
    () =>
      (payouts ?? [])
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0),
    [payouts],
  );

  async function handleRequestPayout() {
    if (!availableBalance || availableBalance <= 0 || isRequesting) return;
    setIsRequesting(true);
    setError(null);

    try {
      const newPayout = await paymentsApi.requestPayout(PAYOUT_METHOD);
      setPayouts((prev) => (prev ? [newPayout, ...prev] : [newPayout]));
      setAvailableBalance(0);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-[#A32D2D]/30 bg-[#FCEBEB] px-4 py-3 text-sm text-[#A32D2D]">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={BanknotesIcon}
          label="Available balance"
          value={availableBalance === null ? "—" : formatAmount(availableBalance)}
        />
        <SummaryCard
          icon={ClockIcon}
          label="Pending payout"
          value={formatAmount(pendingAmount)}
        />
        <SummaryCard
          icon={CheckCircleIcon}
          label="Total paid out"
          value={formatAmount(totalPaidOut)}
        />
      </div>

      {/* Request payout */}
      <div className="flex items-center justify-between rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <div>
          <p className="font-medium text-[#1B3A2B] dark:text-white">
            Request a payout
          </p>
          <p className="text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            {availableBalance !== null && availableBalance > 0
              ? `${formatAmount(availableBalance)} is ready to withdraw.`
              : "No available balance to withdraw right now."}
          </p>
        </div>
        <button
          onClick={handleRequestPayout}
          disabled={!availableBalance || availableBalance <= 0 || isRequesting}
          className="rounded-md bg-[#2F5F3F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B3A2B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRequesting ? "Requesting..." : "Request payout"}
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
              {(payouts ?? []).map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#3B2F22]/5 last:border-0 dark:border-strokedark"
                >
                  <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                    {formatDate(p.date)}
                  </td>
                  <td className="px-4 py-3 text-[#1B3A2B] dark:text-white">
                    {formatAmount(p.amount)}
                  </td>
                  <td className="px-4 py-3 text-[#3B2F22]/70 dark:text-bodydark2">
                    {p.method}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        STATUS_STYLES[p.status as PayoutStatus] ??
                        "bg-[#3B2F22]/10 text-[#3B2F22]"
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

              {payouts !== null && payouts.length === 0 && (
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