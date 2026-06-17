import axios from "axios";
import { STORAGE_KEYS } from "../utils/storageKeys";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// automatically attaches JWT token:
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Frontend calls only your backend.
// Frontend does not call API-Football directly.
// Frontend does not expose x-apisports-key.
// Backend adds API-Football key safely.
