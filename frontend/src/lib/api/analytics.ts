import { apiClient } from "./client";
import type { ApiSuccess } from "./types";

export interface FarmerSummary {
  activeListings: number;
  totalEarnings: number;
  datasetsSold: number;
  averageRating: number;
  ratingCount: number;
}

export interface LicenseSplitItem {
  kind: "one-time" | "time-limited" | "research-only";
  label: string;
  count: number;
  percent: number;
}

export interface TopParty {
  name: string;
  datasetsPurchased: number;
  totalSpent: number;
  lastPurchase: string;
}

export interface BuyerSummary {
  activeLicenses: number;
  totalSpent: number;
  datasetsPurchased: number;
  openDisputes: number;
}

export interface DashboardTrend {
  labels: string[];
  primary: number[];
  secondary: number[];
}

export interface DashboardActivity {
  id: string;
  type: string;
  description: string;
  date: string;
}

export interface BuyerInterest {
  id: string;
  buyerName: string;
  action: string;
  datasetTitle: string;
  date: string;
}

async function unwrap<T>(
  promise: Promise<{ data: ApiSuccess<T> }>,
): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export const analyticsApi = {
  farmerSummary: () =>
    unwrap<FarmerSummary>(apiClient.get("/analytics/farmer/summary")),
  farmerLicenseSplit: () =>
    unwrap<LicenseSplitItem[]>(
      apiClient.get("/analytics/farmer/license-split"),
    ),
  farmerTopBuyers: () =>
    unwrap<TopParty[]>(apiClient.get("/analytics/farmer/top-buyers")),

  buyerSummary: () =>
    unwrap<BuyerSummary>(apiClient.get("/analytics/buyer/summary")),
  buyerLicenseSplit: () =>
    unwrap<LicenseSplitItem[]>(apiClient.get("/analytics/buyer/license-split")),
  buyerTopSellers: () =>
    unwrap<TopParty[]>(apiClient.get("/analytics/buyer/top-sellers")),
  farmerTrends: () =>
    unwrap<DashboardTrend>(apiClient.get("/analytics/farmer/trends")),
  buyerTrends: () =>
    unwrap<DashboardTrend>(apiClient.get("/analytics/buyer/trends")),
  farmerWeekly: () =>
    unwrap<DashboardTrend>(apiClient.get("/analytics/farmer/weekly")),
  buyerWeekly: () =>
    unwrap<DashboardTrend>(apiClient.get("/analytics/buyer/weekly")),
  farmerActivity: () =>
    unwrap<DashboardActivity[]>(apiClient.get("/analytics/farmer/activity")),
  farmerBuyerInterest: () =>
    unwrap<BuyerInterest[]>(apiClient.get("/analytics/farmer/buyer-interest")),
  buyerActivity: () =>
    unwrap<DashboardActivity[]>(apiClient.get("/analytics/buyer/activity")),
};
