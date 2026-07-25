export interface Review {
  id: string;
  buyerName: string;
  datasetTitle: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string; // ISO date
}

export type DisputeStatus = "open" | "resolved" | "rejected";

export interface Dispute {
  id: string;
  buyerName: string;
  datasetTitle: string;
  reason: string;
  status: DisputeStatus;
  date: string; // ISO date
}