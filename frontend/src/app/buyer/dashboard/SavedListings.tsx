import React, { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import {
  marketplaceApi,
  type SavedListing,
} from "../../../lib/api/marketplace";
import { extractErrorMessage } from "../../../lib/api/types";

function initials(text: string) {
  return text.slice(0, 2).toUpperCase();
}

const SavedListings: React.FC = () => {
  const [savedListings, setSavedListings] = useState<SavedListing[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    marketplaceApi
      .saved()
      .then((data) => {
        if (!cancelled) setSavedListings(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(extractErrorMessage(err));
          setSavedListings([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 flex items-center gap-2 px-7.5 text-xl font-semibold text-[#1B3A2B] dark:text-white">
        Saved for later
      </h4>

      <div>
        {error && <p className="px-7.5 text-sm text-[#A32D2D]">{error}</p>}
        {savedListings === null && (
          <p className="px-7.5 text-sm text-[#3B2F22]/50">
            Loading saved listings...
          </p>
        )}
        {savedListings?.map((listing) => (
          <div
            key={listing.id}
            className="flex items-center gap-4 px-7.5 py-3 hover:bg-[#EAF3DE]/60 dark:hover:bg-meta-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3DE] text-xs font-semibold text-[#2F5F3F] dark:bg-[#2F5F3F]/30 dark:text-[#8FBF9F]">
              {initials(listing.cropType)}
            </div>

            <div className="flex flex-1 items-center justify-between gap-2">
              <div className="min-w-0">
                <h5 className="truncate text-sm font-medium text-[#1B3A2B] dark:text-white">
                  {listing.title}
                </h5>
                <p className="text-xs text-[#3B2F22]/60 dark:text-bodydark2">
                  {listing.cropType} · ${listing.price.toFixed(2)}
                </p>
              </div>
              <HeartIcon className="h-4 w-4 shrink-0 text-[#D9A441]" />
            </div>
          </div>
        ))}
        {savedListings !== null && savedListings.length === 0 && !error && (
          <p className="px-7.5 text-sm text-[#3B2F22]/50">
            No saved listings yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedListings;
