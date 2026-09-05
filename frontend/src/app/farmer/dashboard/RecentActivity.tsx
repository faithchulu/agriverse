"use client";

import React, { useEffect, useState } from "react";
import {
  BanknotesIcon,
  StarIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
  analyticsApi,
  type DashboardActivity,
} from "../../../lib/api/analytics";
import { extractErrorMessage } from "../../../lib/api/types";

const STYLES: Record<
  string,
  { icon: typeof BanknotesIcon; bg: string; fg: string }
> = {
  sale: { icon: BanknotesIcon, bg: "bg-[#EAF3DE]", fg: "text-[#2F5F3F]" },
  payout: { icon: BanknotesIcon, bg: "bg-[#FAEEDA]", fg: "text-[#854F0B]" },
  review: { icon: StarIcon, bg: "bg-[#FAEEDA]", fg: "text-[#854F0B]" },
  upload: { icon: CloudArrowUpIcon, bg: "bg-[#E6F1FB]", fg: "text-[#0C447C]" },
};

function timeAgo(date: string) {
  const minutes = Math.max(
    1,
    Math.round((Date.now() - new Date(date).getTime()) / 60000),
  );
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

const RecentActivity: React.FC<{ data?: DashboardActivity[] | null }> = ({
  data,
}) => {
  const [items, setItems] = useState<DashboardActivity[] | null>(data ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setItems(data);
      return;
    }
    analyticsApi
      .farmerActivity()
      .then(setItems)
      .catch((err) => {
        setError(extractErrorMessage(err));
        setItems([]);
      });
  }, [data]);

  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white px-7.5 py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-4 text-xl font-semibold text-[#1B3A2B] dark:text-white">
        Recent activity
      </h4>
      {error && <p className="text-sm text-[#A32D2D]">{error}</p>}
      {items === null && (
        <p className="text-sm text-[#3B2F22]/50">Loading activity...</p>
      )}
      {items !== null && items.length === 0 && !error && (
        <p className="text-sm text-[#3B2F22]/50">No recent activity.</p>
      )}
      <ul className="flex flex-col gap-4">
        {items?.map((item) => {
          const style = STYLES[item.type] ?? STYLES.sale;
          const Icon = style.icon;
          return (
            <li key={item.id} className="flex items-start gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg}`}
              >
                <Icon className={`h-4.5 w-4.5 ${style.fg}`} />
              </span>
              <div>
                <p className="text-sm text-[#1B3A2B] dark:text-white">
                  {item.description}
                </p>
                <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
                  {timeAgo(item.date)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentActivity;
