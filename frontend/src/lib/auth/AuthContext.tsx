"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiClient, TOKEN_STORAGE_KEY } from "../api/client";
import type { ApiSuccess, AuthUser } from "../api/types";

interface RegisterFarmerInput {
  role: "farmer";
  email: string;
  password: string;
  fullName: string;
  farmName?: string;
  farmLocation?: string;
  phone?: string;
}

interface RegisterBuyerInput {
  role: "buyer";
  email: string;
  password: string;
  contactName: string;
  organizationName?: string;
  organizationType?: string;
  phone?: string;
}

export type RegisterInput = RegisterFarmerInput | RegisterBuyerInput;

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function storeSession(token: string) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function clearSession() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiClient
      .get<ApiSuccess<AuthUser>>("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        // Token was invalid/expired — the response interceptor already
        // cleared it from storage; just reflect that in state.
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiClient.post<ApiSuccess<{ user: AuthUser; token: string }>>(
      "/auth/login",
      { email, password },
    );
    const { user: loggedInUser, token } = res.data.data;
    storeSession(token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const res = await apiClient.post<ApiSuccess<{ user: AuthUser; token: string }>>(
      "/auth/register",
      input,
    );
    const { user: newUser, token } = res.data.data;
    storeSession(token);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}