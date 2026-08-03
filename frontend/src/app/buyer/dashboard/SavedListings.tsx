import React from "react";
import { HeartIcon } from "@heroicons/react/24/solid";

interface SavedListing {
  id: string;
  title: string;
  cropType: string;
  price: number;
}

// TODO: replace with `const { data } = await axios.get("/api/buyer/saved-listings")`
const savedListings: SavedListing[] = [
  {
    id: "lst_007",
    title: "Rice paddy nitrogen levels - Lowveld",
    cropType: "Rice",
    price: 90,
  },
  {
    id: "lst_008",
    title: "Sorghum drought resilience trial - Southern Province",
    cropType: "Sorghum",
    price: 180,
  },
  {
    id: "lst_009",
    title: "Wheat hybrid yield trial - Northern Plains",
    cropType: "Wheat",
    price: 250,
  },
  {
    id: "lst_004",
    title: "Cassava root growth sensor data - Central Region",
    cropType: "Cassava",
    price: 60,
  },
];

function initials(text: string) {
  return text.slice(0, 2).toUpperCase();
}

const SavedListings: React.FC = () => {
  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 flex items-center gap-2 px-7.5 text-xl font-semibold text-[#1B3A2B] dark:text-white">
        Saved for later
      </h4>

      <div>
        {savedListings.map((listing) => (
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
      </div>
    </div>
  );
};

export default SavedListings;
