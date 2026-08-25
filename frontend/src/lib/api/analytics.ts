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

async function unwrap<T>(promise: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export const analyticsApi = {
  farmerSummary: () =>
    unwrap<FarmerSummary>(apiClient.get("/analytics/farmer/summary")),
  farmerLicenseSplit: () =>
    unwrap<LicenseSplitItem[]>(apiClient.get("/analytics/farmer/license-split")),
  farmerTopBuyers: () =>
    unwrap<TopParty[]>(apiClient.get("/analytics/farmer/top-buyers")),

  buyerSummary: () =>
    unwrap<BuyerSummary>(apiClient.get("/analytics/buyer/summary")),
  buyerLicenseSplit: () =>
    unwrap<LicenseSplitItem[]>(apiClient.get("/analytics/buyer/license-split")),
  buyerTopSellers: () =>
    unwrap<TopParty[]>(apiClient.get("/analytics/buyer/top-sellers")),
};