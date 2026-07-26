import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TransactionsView from "./TransactionsView";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Your purchase transactions.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            Every purchase, its escrow status, and where the data stands.
          </p>
        </div>

        <TransactionsView />
      </DefaultLayout>
    </>
  );
}