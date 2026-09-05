"use client";
import React, { useEffect, useState } from "react";
import {
  DocumentCheckIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CardDataStats from "../CardDataStats";
import SpendingChart from "../Charts/SpendingChart";
import PurchasesWeekChart from "../Charts/PurchasesWeekChart";
import PurchaseLicenseSplitChart from "../Charts/PurchaseLicenseSplitChart";
import BuyerRecentActivity from "../../app/buyer/dashboard/BuyerRecentActivity";
import TopSellersTable from "../../app/buyer/dashboard/TopSellersTable";
import SavedListings from "../../app/buyer/dashboard/SavedListings";
import { analyticsApi } from "../../lib/api/analytics";
import type {
  BuyerSummary,
  LicenseSplitItem,
  TopParty,
} from "../../lib/api/analytics";
import { extractErrorMessage } from "../../lib/api/types";

const BuyerDashboard: React.FC = () => {
  const [summary, setSummary] = useState<BuyerSummary | null>(null);
  const [licenseSplit, setLicenseSplit] = useState<LicenseSplitItem[] | null>(null);
  const [topSellers, setTopSellers] = useState<TopParty[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [summaryRes, splitRes, sellersRes] = await Promise.all([
          analyticsApi.buyerSummary(),
          analyticsApi.buyerLicenseSplit(),
          analyticsApi.buyerTopSellers(),
        ]);
        if (cancelled) return;
        setSummary(summaryRes);
        setLicenseSplit(splitRes);
        setTopSellers(sellersRes);
      } catch (err) {
        if (cancelled) return;
        setError(extractErrorMessage(err));
        setSummary((prev) => prev ?? {
          activeLicenses: 0,
          totalSpent: 0,
          datasetsPurchased: 0,
          openDisputes: 0,
        });
        setLicenseSplit((prev) => prev ?? []);
        setTopSellers((prev) => prev ?? []);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md border border-[#A32D2D]/30 bg-[#FCEBEB] px-4 py-3 text-sm text-[#A32D2D]">
          Could not load some dashboard data: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Active licenses"
          total={summary ? String(summary.activeLicenses) : "—"}
          rate="Right now"
          icon={DocumentCheckIcon}
        />
        <CardDataStats
          title="Total spent"
          total={summary ? `ZMW ${summary.totalSpent.toFixed(2)}` : "—"}
          rate="All-time"
          icon={BanknotesIcon}
        />
        <CardDataStats
          title="Datasets purchased"
          total={summary ? String(summary.datasetsPurchased) : "—"}
          rate="All-time"
          icon={ShoppingBagIcon}
        />
        <CardDataStats
          title="Open disputes"
          total={summary ? String(summary.openDisputes) : "—"}
          rate="Right now"
          icon={ExclamationTriangleIcon}
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Still on placeholder data — no /analytics endpoint exists yet
            for a monthly spending trend or a weekly activity breakdown. */}
        <SpendingChart />
        <PurchasesWeekChart />

        <PurchaseLicenseSplitChart data={licenseSplit} />

        {/* Still on placeholder data — no /analytics endpoint exists yet
            for a buyer activity feed. */}
        <BuyerRecentActivity />

        <TopSellersTable sellers={topSellers} />

        {/* Still on placeholder data — wishlist/saved listings aren't
            persisted anywhere in the backend yet (the Marketplace page's
            heart toggle is local component state only). */}
        <SavedListings />
      </div>
    </>
  );
};

export default BuyerDashboard;