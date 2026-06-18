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

// If token expires or becomes invalid:
// Backend returns 401,Frontend clears token,Navbar changes to Login/Register,Protected routes redirect correctly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);

      window.dispatchEvent(new Event("auth-change"));
      window.dispatchEvent(new Event("auth-expired"));
    }

    return Promise.reject(error);
  },
);

// Frontend calls only your backend.
// Frontend does not call API-Football directly.
// Frontend does not expose x-apisports-key.
// Backend adds API-Football key safely.
