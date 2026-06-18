import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { favoriteService } from "../../services/favoriteService";
import { STORAGE_KEYS } from "../../utils/storageKeys";

export const FavoriteButton = ({ favorite }) => {
  const [savedFavoriteId, setSavedFavoriteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const isLoggedIn = Boolean(token);

  const checkFavoriteStatus = async () => {
    if (!isLoggedIn || !favorite?.externalId || !favorite?.type) {
      return;
    }

    try {
      setChecking(true);

      const favorites = await favoriteService.getFavorites();

      const existingFavorite = favorites.find(
        (item) =>
          item.type === favorite.type &&
          Number(item.externalId) === Number(favorite.externalId),
      );

      setSavedFavoriteId(existingFavorite?._id || existingFavorite?.id || null);
    } catch {
      setSavedFavoriteId(null);
    } finally {
      setChecking(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!favorite || loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (savedFavoriteId) {
        await favoriteService.removeFavorite(savedFavoriteId);
        setSavedFavoriteId(null);
      } else {
        const savedFavorite = await favoriteService.addFavorite(favorite);

        setSavedFavoriteId(savedFavorite?._id || savedFavorite?.id || true);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update favorite",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFavoriteStatus();
  }, [favorite?.type, favorite?.externalId]);

  if (!isLoggedIn) {
    return (
      <Link to="/login" className="favorite-login-link">
        Login to save
      </Link>
    );
  }

  return (
    <div className="favorite-action">
      <button
        type="button"
        className={
          savedFavoriteId ? "favorite-button saved" : "favorite-button"
        }
        disabled={loading || checking}
        onClick={handleToggleFavorite}
      >
        {savedFavoriteId ? "Saved" : "Save Favorite"}
      </button>

      {error && <span className="favorite-error">{error}</span>}
    </div>
  );
};
