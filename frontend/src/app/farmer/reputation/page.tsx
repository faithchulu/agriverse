import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ReputationView from "./ReputationView";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Your ratings and dispute history.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
            Reputation
          </h1>
          <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            How buyers have rated your datasets, and any disputes raised.
          </p>
        </div>

        <ReputationView />
      </DefaultLayout>
    </>
  );
}