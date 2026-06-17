import { STORAGE_KEYS } from "./storageKeys";
import { getStorageItem, setStorageItem } from "./storage";

export const getGuestFavorites = () => {
  return getStorageItem(STORAGE_KEYS.GUEST_FAVORITES, []);
};

export const addGuestFavorite = (favorite) => {
  const favorites = getGuestFavorites();

  const alreadyExists = favorites.some(
    (item) =>
      item.type === favorite.type && item.externalId === favorite.externalId,
  );

  if (alreadyExists) {
    return favorites;
  }

  const updatedFavorites = [...favorites, favorite];

  setStorageItem(STORAGE_KEYS.GUEST_FAVORITES, updatedFavorites);

  return updatedFavorites;
};

export const removeGuestFavorite = ({ type, externalId }) => {
  const favorites = getGuestFavorites();

  const updatedFavorites = favorites.filter(
    (item) => !(item.type === type && item.externalId === externalId),
  );

  setStorageItem(STORAGE_KEYS.GUEST_FAVORITES, updatedFavorites);

  return updatedFavorites;
};

export const clearGuestFavorites = () => {
  setStorageItem(STORAGE_KEYS.GUEST_FAVORITES, []);
};

// This prepares guest favorite logic.
// Meaning: even if user is not logged in, they can favorite teams/leagues locally.
// Later, after login, you can sync guest favorites to backend using:
// POST /api/favorites/sync
