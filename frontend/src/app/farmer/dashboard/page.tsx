import FarmerDashboard from "@/components/Dashboard/FarmerDashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Your farmer dashboard.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <FarmerDashboard />
      </DefaultLayout>
    </>
  );
}
