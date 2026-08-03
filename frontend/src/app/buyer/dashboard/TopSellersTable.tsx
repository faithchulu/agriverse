import React from "react";

interface TopSeller {
  name: string;
  datasetsPurchased: number;
  totalSpent: number;
  lastPurchase: string; // ISO date
}

// TODO: replace with `const { data } = await axios.get("/api/buyer/top-sellers")`
const topSellers: TopSeller[] = [
  {
    name: "Mwansa Family Farm",
    datasetsPurchased: 2,
    totalSpent: 300,
    lastPurchase: "2026-07-06",
  },
  {
    name: "Green Acres Cooperative",
    datasetsPurchased: 2,
    totalSpent: 310,
    lastPurchase: "2026-07-16",
  },
  {
    name: "Zambezi Valley Farms",
    datasetsPurchased: 1,
    totalSpent: 90,
    lastPurchase: "2026-07-20",
  },
  {
    name: "Kalunga Farms",
    datasetsPurchased: 1,
    totalSpent: 75,
    lastPurchase: "2026-07-19",
  },
];

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

const TopSellersTable: React.FC = () => {
  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <h4 className="mb-6 text-xl font-semibold text-[#1B3A2B] dark:text-white">
        Sellers you buy from most
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-[#EAF3DE] dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase text-[#1B3A2B] xsm:text-base dark:text-white">
              Seller
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase text-[#1B3A2B] xsm:text-base dark:text-white">
              Datasets
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase text-[#1B3A2B] xsm:text-base dark:text-white">
              Total spent
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase text-[#1B3A2B] xsm:text-base dark:text-white">
              Last purchase
            </h5>
          </div>
        </div>

        {topSellers.map((seller, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${
              key === topSellers.length - 1
                ? ""
                : "border-b border-[#3B2F22]/10 dark:border-strokedark"
            }`}
            key={seller.name}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3DE] text-xs font-semibold text-[#2F5F3F] dark:bg-[#2F5F3F]/30 dark:text-[#8FBF9F]">
                {initials(seller.name)}
              </div>
              <p className="hidden text-[#1B3A2B] dark:text-white sm:block">
                {seller.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-[#1B3A2B] dark:text-white">
                {seller.datasetsPurchased}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-[#2F5F3F]">ZMW {seller.totalSpent.toFixed(2)}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-[#3B2F22]/60 dark:text-bodydark2">
                {formatDate(seller.lastPurchase)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellersTable;
