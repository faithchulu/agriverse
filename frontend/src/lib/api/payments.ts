import { apiClient } from "./client";
import type { ApiSuccess } from "./types";

export interface Transaction {
  id: string;
  datasetId?: string;
  datasetTitle?: string;
  sellerName?: string;
  buyerName?: string;
  licenseType: string;
  amount: number;
  status: string;
  date: string;
}

export interface LicenseRecord {
  id: string;
  datasetTitle: string;
  sellerName: string;
  licenseKind: string;
  grantedDate: string;
  expiryDate: string | null;
  state: string;
}

async function unwrap<T>(promise: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export const paymentsApi = {
  // Purchase flow — each step is a separate real backend call, chained
  // by the caller. Kept as three distinct functions (not one "buy()"
  // that does all three) so a future UI that shows real escrow steps
  // doesn't need the API layer rewritten, just the calling code.
  purchase: (datasetId: string) =>
    unwrap<{ id: string }>(apiClient.post(`/payments/listings/${datasetId}/purchase`)),
  pay: (transactionId: string) =>
    unwrap<{ id: string }>(apiClient.post(`/payments/transactions/${transactionId}/pay`)),
  release: (transactionId: string) =>
    unwrap<{ id: string }>(apiClient.post(`/payments/transactions/${transactionId}/release`)),
  dispute: (transactionId: string, reason: string) =>
    unwrap<{ id: string }>(
      apiClient.post(`/payments/transactions/${transactionId}/dispute`, { reason }),
    ),

  myTransactions: () => unwrap<Transaction[]>(apiClient.get("/payments/transactions/mine")),
  myLicenses: () => unwrap<LicenseRecord[]>(apiClient.get("/payments/licenses/mine")),

  payoutBalance: () =>
    unwrap<{ availableBalance: number }>(apiClient.get("/payments/payouts/balance")),
  requestPayout: (method: string) =>
    unwrap<{ id: string }>(apiClient.post("/payments/payouts", { method })),
  myPayouts: () => unwrap<any[]>(apiClient.get("/payments/payouts/mine")),
};