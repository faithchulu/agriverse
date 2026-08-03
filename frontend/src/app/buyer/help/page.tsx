import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BuyerHelpView from "./BuyerHelpView";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Help and support.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
            Help
          </h1>
          <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            How buying and licensing work, and how to reach us if something's
            wrong.
          </p>
        </div>

        <BuyerHelpView />
      </DefaultLayout>
    </>
  );
}