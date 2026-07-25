export type ListingStatus = "draft" | "live" | "sold" | "withdrawn";

export interface Listing {
  id: string;
  title: string;
  cropType: string;
  region: string;
  price: number;
  status: ListingStatus;
  uploadedDate: string; // ISO date
  buyersInterested: number;
}