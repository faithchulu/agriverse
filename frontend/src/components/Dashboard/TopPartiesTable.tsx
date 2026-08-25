import React from "react";
import type { TopParty } from "../../lib/api/analytics";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Shared by TopBuyersTable (farmer dashboard) and TopSellersTable (buyer
// dashboard) — identical shape, different labels and empty-state copy.
export default function TopPartiesTable({
  title,
  partyLabel,
  emptyMessage,
  parties,
}: {
  title: string;
  partyLabel: string;
  emptyMessage: string;
  parties: TopParty[] | null;
}) {
  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <h4 className="mb-6 text-xl font-semibold text-[#1B3A2B] dark:text-white">
        {title}
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-[#EAF3DE] dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase text-[#1B3A2B] dark:text-white xsm:text-base">
              {partyLabel}
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase text-[#1B3A2B] dark:text-white xsm:text-base">
              Datasets
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase text-[#1B3A2B] dark:text-white xsm:text-base">
              Total spent
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase text-[#1B3A2B] dark:text-white xsm:text-base">
              Last purchase
            </h5>
          </div>
        </div>

        {parties === null && (
          <p className="p-6 text-center text-sm text-[#3B2F22]/40">Loading…</p>
        )}

        {parties !== null && parties.length === 0 && (
          <p className="p-6 text-center text-sm text-[#3B2F22]/40">
            {emptyMessage}
          </p>
        )}

        {parties?.map((party, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${
              key === parties.length - 1
                ? ""
                : "border-b border-[#3B2F22]/10 dark:border-strokedark"
            }`}
            key={party.name + key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3DE] text-xs font-semibold text-[#2F5F3F] dark:bg-[#2F5F3F]/30 dark:text-[#8FBF9F]">
                {initials(party.name)}
              </div>
              <p className="hidden text-[#1B3A2B] dark:text-white sm:block">
                {party.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-[#1B3A2B] dark:text-white">
                {party.datasetsPurchased}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-[#2F5F3F]">${party.totalSpent.toFixed(2)}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-[#3B2F22]/60 dark:text-bodydark2">
                {formatDate(party.lastPurchase)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
