import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PayoutsView from "./PayoutsView";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Your payouts.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
            Payouts
          </h1>
          <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            Your balance, and where past payouts stand.
          </p>
        </div>

        <PayoutsView />
      </DefaultLayout>
    </>
  );
}