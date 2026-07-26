import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MarketplaceView from "./MarketplaceView";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Browse agricultural datasets.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
            Marketplace
          </h1>
          <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            Browse soil metrics, yield records, and sensor data from
            verified farmers.
          </p>
        </div>

        <MarketplaceView />
      </DefaultLayout>
    </>
  );
}