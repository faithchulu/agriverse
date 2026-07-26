export type PurchaseStatus = "completed" | "refunded";

export interface Purchase {
  id: string;
  datasetTitle: string;
  sellerName: string;
  licenseType: string;
  price: number;
  purchaseDate: string; // ISO date
  status: PurchaseStatus;
}