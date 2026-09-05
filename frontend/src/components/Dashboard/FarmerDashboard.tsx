"use client";
import React, { useEffect, useState } from "react";
import {
  CircleStackIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import CardDataStats from "../CardDataStats";
import EarningsChart from "../Charts/EarningsChart";
import SalesWeekChart from "../Charts/SalesWeekChart";
import LicenseSplitChart from "../Charts/LicenseSplitChart";
import RecentActivity from "../../app/farmer/dashboard/RecentActivity";
import TopBuyersTable from "../../app/farmer/dashboard/TopBuyersTable";
import RecentBuyerInterest from "../../app/farmer/dashboard/RecentBuyerInterest";
import {
  analyticsApi,
  type DashboardActivity,
  type DashboardTrend,
  type BuyerInterest,
} from "../../lib/api/analytics";
import type {
  FarmerSummary,
  LicenseSplitItem,
  TopParty,
} from "../../lib/api/analytics";
import { extractErrorMessage } from "../../lib/api/types";

const FarmerDashboard: React.FC = () => {
  const [summary, setSummary] = useState<FarmerSummary | null>(null);
  const [licenseSplit, setLicenseSplit] = useState<LicenseSplitItem[] | null>(
    null,
  );
  const [topBuyers, setTopBuyers] = useState<TopParty[] | null>(null);
  const [trends, setTrends] = useState<DashboardTrend | null>(null);
  const [weekly, setWeekly] = useState<DashboardTrend | null>(null);
  const [activity, setActivity] = useState<DashboardActivity[] | null>(null);
  const [buyerInterest, setBuyerInterest] = useState<BuyerInterest[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          summaryRes,
          splitRes,
          buyersRes,
          trendsRes,
          weeklyRes,
          activityRes,
          interestRes,
        ] = await Promise.all([
          analyticsApi.farmerSummary(),
          analyticsApi.farmerLicenseSplit(),
          analyticsApi.farmerTopBuyers(),
          analyticsApi.farmerTrends(),
          analyticsApi.farmerWeekly(),
          analyticsApi.farmerActivity(),
          analyticsApi.farmerBuyerInterest(),
        ]);
        if (cancelled) return;
        setSummary(summaryRes);
        setLicenseSplit(splitRes);
        setTopBuyers(buyersRes);
        setTrends(trendsRes);
        setWeekly(weeklyRes);
        setActivity(activityRes);
        setBuyerInterest(interestRes);
      } catch (err) {
        if (cancelled) return;
        setError(extractErrorMessage(err));
        // Fall back to empty/zero states so the dashboard still renders
        // something sensible instead of spinning forever.
        setSummary(
          (prev) =>
            prev ?? {
              activeListings: 0,
              totalEarnings: 0,
              datasetsSold: 0,
              averageRating: 0,
              ratingCount: 0,
            },
        );
        setLicenseSplit((prev) => prev ?? []);
        setTopBuyers((prev) => prev ?? []);
        setActivity((prev) => prev ?? []);
        setBuyerInterest((prev) => prev ?? []);
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
          title="Active listings"
          total={summary ? String(summary.activeListings) : "—"}
          rate="Live now"
          icon={CircleStackIcon}
        />
        <CardDataStats
          title="Total earnings"
          total={summary ? `$${summary.totalEarnings.toFixed(2)}` : "—"}
          rate="All-time"
          icon={BanknotesIcon}
        />
        <CardDataStats
          title="Datasets sold"
          total={summary ? String(summary.datasetsSold) : "—"}
          rate="All-time"
          icon={ArchiveBoxIcon}
        />
        <CardDataStats
          title="Average rating"
          total={summary ? summary.averageRating.toFixed(1) : "—"}
          rate={summary ? `${summary.ratingCount} ratings` : "—"}
          icon={StarIcon}
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Still on placeholder data — no /analytics endpoint exists yet
            for a monthly earnings trend or a weekly activity breakdown. */}
        <EarningsChart data={trends} />
        <SalesWeekChart data={weekly} />

        <LicenseSplitChart data={licenseSplit} />

        {/* Still on placeholder data — no /analytics endpoint exists yet
            for a farmer activity feed. */}
        <RecentActivity data={activity} />

        <TopBuyersTable buyers={topBuyers} />

        {/* Still on placeholder data — "saved/interested buyers" isn't
            tracked anywhere in the backend yet. */}
        <RecentBuyerInterest data={buyerInterest} />
      </div>
    </>
  );
};

export default FarmerDashboard;
