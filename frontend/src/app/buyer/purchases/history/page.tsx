import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PurchaseHistoryView from "./PurchaseHistoryView";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Your purchase history.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
            Purchase history
          </h1>
          <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            Every dataset you&apos;ve bought, and what you paid for it.
          </p>
        </div>

        <PurchaseHistoryView />
      </DefaultLayout>
    </>
  );
}