import { apiClient } from "./apiClient";
import { API_ROUTES } from "../config/apiRoutes";

const extractFavorites = (responseData) => {
  return responseData.data || responseData.favorites || [];
};

export const favoriteService = {
  getFavorites: async () => {
    const response = await apiClient.get(API_ROUTES.favorites.list);

    return extractFavorites(response.data);
  },

  addFavorite: async (favorite) => {
    const response = await apiClient.post(API_ROUTES.favorites.add, favorite);

    return response.data.data || response.data.favorite || response.data;
  },

  removeFavorite: async (favoriteId) => {
    const response = await apiClient.delete(
      API_ROUTES.favorites.remove(favoriteId),
    );

    return response.data;
  },
};
