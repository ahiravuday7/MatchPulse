import { apiClient } from "./apiClient";
import { API_ROUTES } from "../config/apiRoutes";
import { STORAGE_KEYS } from "../utils/storageKeys";

const saveAuthData = ({ token, user }) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  if (user) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  }
};

const extractAuthData = (responseData) => {
  return {
    token: responseData.token || responseData.data?.token,
    user: responseData.user || responseData.data?.user || responseData.data,
  };
};

export const authService = {
  register: async ({ name, email, password }) => {
    const response = await apiClient.post(API_ROUTES.auth.register, {
      name,
      email,
      password,
    });

    const authData = extractAuthData(response.data);
    saveAuthData(authData);

    return authData;
  },

  login: async ({ email, password }) => {
    const response = await apiClient.post(API_ROUTES.auth.login, {
      email,
      password,
    });

    const authData = extractAuthData(response.data);
    saveAuthData(authData);

    return authData;
  },

  logout: async () => {
    try {
      await apiClient.post(API_ROUTES.auth.logout);
    } catch {
      // Frontend logout should still clear storage even if backend logout fails.
    }

    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  isLoggedIn: () => {
    return Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
  },
};
