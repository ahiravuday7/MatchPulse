import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { favoriteService } from "../../services/favoriteService";
import { STORAGE_KEYS } from "../../utils/storageKeys";

const getAuthUserId = () => {
  const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

  if (!user) {
    return "";
  }

  try {
    return JSON.parse(user)?.id || "";
  } catch {
    return "";
  }
};

export const FavoriteButton = ({ favorite }) => {
  const location = useLocation();

  const [savedFavoriteId, setSavedFavoriteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [authVersion, setAuthVersion] = useState(0);

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const isLoggedIn = Boolean(token);
  const authUserId = getAuthUserId();

  const favoriteKey = useMemo(() => {
    if (!favorite?.type || !favorite?.externalId) {
      return "";
    }

    return `${favorite.type}-${favorite.externalId}`;
  }, [favorite?.type, favorite?.externalId]);

  const checkFavoriteStatus = async () => {
    setError("");

    if (!isLoggedIn || !favorite?.externalId || !favorite?.type) {
      setSavedFavoriteId(null);
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

        setSavedFavoriteId(savedFavorite?._id || savedFavorite?.id || null);

        await checkFavoriteStatus();
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
    const handleAuthChange = () => {
      setAuthVersion((value) => value + 1);
      setSavedFavoriteId(null);
      setError("");
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    checkFavoriteStatus();
  }, [favoriteKey, authUserId, authVersion]);

  if (!isLoggedIn) {
    return (
      <Link
        to="/login"
        state={{
          from: location.pathname,
        }}
        className="favorite-login-link"
      >
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
