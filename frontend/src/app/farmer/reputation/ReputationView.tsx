"use client";

import { useMemo } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { dummyReviews, dummyDisputes, ratingBreakdown } from "./dummy-data";
import type { DisputeStatus } from "../../../types/Dispute";

const DISPUTE_STYLES: Record<DisputeStatus, string> = {
  open: "bg-[#FCEBEB] text-[#A32D2D]",
  resolved: "bg-[#EAF3DE] text-[#2F5F3F]",
  rejected: "bg-[#3B2F22]/10 text-[#3B2F22]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          className={`h-4 w-4 ${
            n <= rating ? "text-[#D9A441]" : "text-[#3B2F22]/15"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReputationView() {
  const totalRatings = ratingBreakdown.reduce((sum, n) => sum + n, 0);

  const average = useMemo(() => {
    const weighted = ratingBreakdown.reduce(
      (sum, count, i) => sum + count * (5 - i),
      0,
    );
    return totalRatings === 0 ? 0 : weighted / totalRatings;
  }, [totalRatings]);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-6 rounded-lg border border-[#8FBF9F]/30 bg-white p-6 sm:grid-cols-[auto_1fr] dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col items-center justify-center gap-1 sm:border-r sm:border-[#3B2F22]/10 sm:pr-6 dark:sm:border-strokedark">
          <p className="text-4xl font-semibold text-[#1B3A2B] dark:text-white">
            {average.toFixed(1)}
          </p>
          <StarRow rating={Math.round(average)} />
          <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
            {totalRatings} ratings
          </p>
        </div>

        <div className="flex flex-col justify-center gap-2">
          {ratingBreakdown.map((count, i) => {
            const stars = 5 - i;
            const pct = totalRatings === 0 ? 0 : (count / totalRatings) * 100;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-xs text-[#3B2F22]/60 dark:text-bodydark2">
                  {stars} star
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#3B2F22]/10">
                  <div
                    className="h-full rounded-full bg-[#D9A441]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-xs text-[#3B2F22]/50 dark:text-bodydark2">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div className="rounded-lg border border-[#8FBF9F]/30 bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-[#3B2F22]/10 p-4 dark:border-strokedark">
          <h2 className="text-sm font-semibold text-[#1B3A2B] dark:text-white">
            Buyer reviews
          </h2>
        </div>
        <ul className="divide-y divide-[#3B2F22]/5 dark:divide-strokedark">
          {dummyReviews.map((review) => (
            <li key={review.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[#1B3A2B] dark:text-white">
                  {review.buyerName}
                </p>
                <StarRow rating={review.rating} />
              </div>
              <p className="mt-1 text-xs text-[#3B2F22]/50 dark:text-bodydark2">
                {review.datasetTitle} · {formatDate(review.date)}
              </p>
              <p className="mt-2 text-sm text-[#3B2F22]/80 dark:text-bodydark">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Disputes */}
      <div className="rounded-lg border border-[#8FBF9F]/30 bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-[#3B2F22]/10 p-4 dark:border-strokedark">
          <h2 className="text-sm font-semibold text-[#1B3A2B] dark:text-white">
            Dispute history
          </h2>
        </div>

        {dummyDisputes.length === 0 ? (
          <p className="p-4 text-sm text-[#3B2F22]/50 dark:text-bodydark2">
            No disputes on record.
          </p>
        ) : (
          <ul className="divide-y divide-[#3B2F22]/5 dark:divide-strokedark">
            {dummyDisputes.map((dispute) => (
              <li key={dispute.id} className="flex gap-3 p-4">
                <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#3B2F22]/40" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[#1B3A2B] dark:text-white">
                      {dispute.buyerName}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        DISPUTE_STYLES[dispute.status]
                      }`}
                    >
                      {dispute.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#3B2F22]/50 dark:text-bodydark2">
                    {dispute.datasetTitle} · {formatDate(dispute.date)}
                  </p>
                  <p className="mt-2 text-sm text-[#3B2F22]/80 dark:text-bodydark">
                    {dispute.reason}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}