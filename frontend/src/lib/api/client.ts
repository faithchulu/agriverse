import axios from "axios";

export const TOKEN_STORAGE_KEY = "agriverse_token";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// A 401 means the token is invalid/expired — clear it so nothing keeps
// retrying with a dead token. We deliberately don't hard-redirect here;
// AuthContext/AuthGate handle that declaratively once `user` becomes null,
// which avoids a jarring redirect firing mid-request from deep inside a
// random component that happens to make an API call.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    return Promise.reject(error);
  },
);