import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AccountView from "./AccountView";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Your account settings.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
            Account
          </h1>
          <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
            Manage your profile, notifications, and security.
          </p>
        </div>

        <AccountView />
      </DefaultLayout>
    </>
  );
}