export type LicenseKind = "one-time" | "time-limited" | "research-only";
export type LicenseState = "active" | "expired" | "used";

export interface License {
  id: string;
  datasetTitle: string;
  sellerName: string;
  licenseKind: LicenseKind;
  grantedDate: string; // ISO date
  expiryDate?: string; // ISO date, only for time-limited
  state: LicenseState;
}