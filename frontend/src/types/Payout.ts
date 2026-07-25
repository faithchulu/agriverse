export type PayoutStatus = "pending" | "completed" | "failed";

export interface Payout {
  id: string;
  date: string; // ISO date
  amount: number;
  method: string;
  status: PayoutStatus;
  reference: string;
}