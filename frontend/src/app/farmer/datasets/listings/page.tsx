import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ListingsTable from "./ListingsTable";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Upload your data.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
              My listings
            </h1>
            <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
              Track and manage the datasets you've listed on the marketplace.
            </p>
          </div>
        </div>

        <ListingsTable />
      </DefaultLayout>
    </>
  );
}