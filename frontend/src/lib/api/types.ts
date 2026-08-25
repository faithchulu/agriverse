export type ApiSuccess<T> = { success: true; data: T };
export type ApiErrorDetail = { path: string; message: string };
export type ApiError = {
  success: false;
  error: { message: string; details?: ApiErrorDetail[] };
};

export type Role = "FARMER" | "BUYER";

export interface FarmerProfile {
  id: string;
  fullName: string;
  farmName: string | null;
  farmLocation: string | null;
  phone: string | null;
  bio: string | null;
}

export interface BuyerProfile {
  id: string;
  contactName: string;
  organizationName: string | null;
  organizationType: string | null;
  phone: string | null;
  bio: string | null;
  verified: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  farmerProfile: FarmerProfile | null;
  buyerProfile: BuyerProfile | null;
}

// Extracts the friendliest possible message from an axios error, whether
// it's our API's shaped error or a network-level failure.
export function extractErrorMessage(err: unknown): string {
  const withResponse = err as {
    response?: { data?: ApiError };
    message?: string;
  };
  return (
    withResponse?.response?.data?.error?.message ||
    withResponse?.message ||
    "Something went wrong"
  );
}