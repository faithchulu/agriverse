export type LicenseType = "one-time" | "time-limited" | "research-only";
 
export interface MarketplaceListing {
  id: string;
  title: string;
  cropType: string;
  region: string;
  price: number;
  licenseType: LicenseType;
  sellerName: string;
  sellerRating: number; // 0-5
  uploadedDate: string; // ISO date
}