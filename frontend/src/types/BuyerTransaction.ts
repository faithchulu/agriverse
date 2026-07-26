export type TransactionStatus =
  | "pending"
  | "paid"
  | "released"
  | "disputed"
  | "refunded";

export interface Transaction {
  id: string;
  sellerName: string;
  datasetTitle: string;
  licenseType: string;
  amount: number;
  status: TransactionStatus;
  date: string; // ISO date
}