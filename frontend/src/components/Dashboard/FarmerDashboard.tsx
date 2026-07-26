"use client";
import React from "react";
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

const FarmerDashboard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Active listings"
          total="5"
          rate="+2 this month"
          levelUp
          icon={CircleStackIcon}
        />
        <CardDataStats
          title="Total earnings"
          total="ZMW 1,240"
          rate="8.2%"
          levelUp
          icon={BanknotesIcon}
        />
        <CardDataStats
          title="Datasets sold"
          total="9"
          rate="12.5%"
          levelUp
          icon={ArchiveBoxIcon}
        />
        <CardDataStats
          title="Average rating"
          total="4.6"
          rate="0.2"
          levelUp
          icon={StarIcon}
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <EarningsChart />
        <SalesWeekChart />
        <LicenseSplitChart />
        <RecentActivity />
        <TopBuyersTable />
        <RecentBuyerInterest />
      </div>
    </>
  );
};

export default FarmerDashboard;
