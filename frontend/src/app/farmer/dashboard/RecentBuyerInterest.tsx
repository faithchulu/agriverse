"use client";

import React, { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { analyticsApi, type BuyerInterest } from "../../../lib/api/analytics";
import { extractErrorMessage } from "../../../lib/api/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(date: string) {
  const minutes = Math.max(
    1,
    Math.round((Date.now() - new Date(date).getTime()) / 60000),
  );
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}

const RecentBuyerInterest: React.FC<{ data?: BuyerInterest[] | null }> = ({
  data,
}) => {
  const [items, setItems] = useState<BuyerInterest[] | null>(data ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setItems(data);
      return;
    }
    analyticsApi
      .farmerBuyerInterest()
      .then(setItems)
      .catch((err) => {
        setError(extractErrorMessage(err));
        setItems([]);
      });
  }, [data]);

  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-[#1B3A2B] dark:text-white">
        Recent buyer interest
      </h4>
      {error && <p className="px-7.5 text-sm text-[#A32D2D]">{error}</p>}
      {items === null && (
        <p className="px-7.5 text-sm text-[#3B2F22]/50">Loading interest...</p>
      )}
      {items !== null && items.length === 0 && !error && (
        <p className="px-7.5 text-sm text-[#3B2F22]/50">
          No buyer activity yet.
        </p>
      )}
      <div>
        {items?.map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-7.5 py-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3DE] text-xs font-semibold text-[#2F5F3F]">
              {initials(item.buyerName)}
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <div className="min-w-0">
                <h5 className="text-sm font-medium text-[#1B3A2B] dark:text-white">
                  {item.buyerName}
                </h5>
                <p className="text-xs text-[#3B2F22]/60 dark:text-bodydark2">
                  {item.action}{" "}
                  <span className="font-medium">{item.datasetTitle}</span>
                  <span className="text-[#3B2F22]/40">
                    {" "}
                    · {timeAgo(item.date)}
                  </span>
                </p>
              </div>
              <HeartIcon className="h-4 w-4 shrink-0 text-[#D9A441]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBuyerInterest;
