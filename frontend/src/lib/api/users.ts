import { apiClient } from "./client";
import type { ApiSuccess, AuthUser } from "./types";

export interface UpdateProfileInput {
  email?: string;
  phone?: string;
  bio?: string;
  fullName?: string;
  farmName?: string;
  farmLocation?: string;
  contactName?: string;
  organizationName?: string;
  organizationType?: string;
}

async function unwrap<T>(
  promise: Promise<{ data: ApiSuccess<T> }>,
): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export const usersApi = {
  updateProfile: (input: UpdateProfileInput) =>
    unwrap<AuthUser>(apiClient.put("/users/me/profile", input)),

  changePassword: (currentPassword: string, newPassword: string) =>
    unwrap<{ message: string }>(
      apiClient.put("/users/me/password", {
        currentPassword,
        newPassword,
      }),
    ),
};
