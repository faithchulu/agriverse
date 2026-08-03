import BuyerDashboard from "@/components/Dashboard/BuyerDashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Your buyer dashboard.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <BuyerDashboard />
      </DefaultLayout>
    </>
  );
}
