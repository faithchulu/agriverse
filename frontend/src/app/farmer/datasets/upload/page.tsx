import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UploadForm from "./UploadForm";

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Upload your data.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
              Upload dataset
            </h1>
            <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
              Share soil metrics, yield records, or sensor data with
              researchers and seed companies - you set the price and terms.
            </p>
          </div>

          <UploadForm />
        </div>
      </DefaultLayout>
    </>
  );
}