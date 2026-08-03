"use client";
import React from "react";
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

const BuyerDashboard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Active licenses"
          total="3"
          rate="+1 this month"
          levelUp
          icon={DocumentCheckIcon}
        />
        <CardDataStats
          title="Total spent"
          total="$450"
          rate="4.5%"
          levelDown
          icon={BanknotesIcon}
        />
        <CardDataStats
          title="Datasets purchased"
          total="5"
          rate="12.5%"
          levelUp
          icon={ShoppingBagIcon}
        />
        <CardDataStats
          title="Open disputes"
          total="1"
          rate="No change"
          icon={ExclamationTriangleIcon}
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <SpendingChart />
        <PurchasesWeekChart />
        <PurchaseLicenseSplitChart />
        <BuyerRecentActivity />
        <TopSellersTable />
        <SavedListings />
      </div>
    </>
  );
};

export default BuyerDashboard;
