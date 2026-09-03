import { apiClient } from "./client";
import type { ApiSuccess } from "./types";
import type { LicenseType } from "../../types/Licensing";

export interface ApiMarketplaceListing {
  id: string;
  title: string;
  cropType: string;
  region: string;
  price: number;
  licenseType: LicenseType;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerRatingCount: number;
  uploadedDate: string;
}

export interface BrowseListingsParams {
  search?: string;
  cropType?: string;
  licenseType?: LicenseType | "all";
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

export interface BrowseListingsResult {
  items: ApiMarketplaceListing[];
  total: number;
  page: number;
  limit: number;
}

export const marketplaceApi = {
  async browse(params: BrowseListingsParams = {}): Promise<BrowseListingsResult> {
    const query: Record<string, string | number> = {};
    if (params.search) query.search = params.search;
    if (params.cropType && params.cropType !== "All crops") query.cropType = params.cropType;
    if (params.licenseType && params.licenseType !== "all") query.licenseType = params.licenseType;
    if (params.sort) query.sort = params.sort;
    query.page = params.page ?? 1;
    query.limit = params.limit ?? 50; // backend max; marketplace is small enough for one page

    const res = await apiClient.get<ApiSuccess<BrowseListingsResult>>(
      "/marketplace/listings",
      { params: query },
    );
    return res.data.data;
  },
};