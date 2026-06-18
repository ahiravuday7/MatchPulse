import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { favoriteService } from "../services/favoriteService";
import { STORAGE_KEYS } from "../utils/storageKeys";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

const getFavoriteLink = (favorite) => {
  if (favorite.type === "team") {
    return `/teams/${favorite.externalId}`;
  }

  if (favorite.type === "league") {
    return `/leagues/${favorite.externalId}/standings`;
  }

  if (favorite.type === "player") {
    return `/players/${favorite.externalId}`;
  }

  return "/";
};

const FavoriteCard = ({ favorite, onRemove }) => {
  return (
    <div className="favorite-card">
      <Link to={getFavoriteLink(favorite)} className="favorite-card-main">
        <div className="favorite-card-logo">
          {favorite.logo && <img src={favorite.logo} alt={favorite.name} />}
        </div>

        <div>
          <h3>{favorite.name}</h3>

          <p>
            {favorite.type}
            {favorite.country ? ` • ${favorite.country}` : ""}
          </p>

          {favorite.type === "player" && (
            <span>
              {favorite.meta?.teamName || "Unknown team"}
              {favorite.meta?.position ? ` • ${favorite.meta.position}` : ""}
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        className="favorite-remove-button"
        onClick={() => onRemove(favorite)}
      >
        Remove
      </button>
    </div>
  );
};

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const isLoggedIn = Boolean(token);

  const groupedFavorites = useMemo(() => {
    return {
      players: favorites.filter((favorite) => favorite.type === "player"),
      teams: favorites.filter((favorite) => favorite.type === "team"),
      leagues: favorites.filter((favorite) => favorite.type === "league"),
    };
  }, [favorites]);

  const fetchFavorites = async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await favoriteService.getFavorites();
      setFavorites(result);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load favorites",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favorite) => {
    const favoriteId = favorite._id || favorite.id;

    if (!favoriteId) {
      return;
    }

    try {
      setRemovingId(favoriteId);

      await favoriteService.removeFavorite(favoriteId);

      setFavorites((currentFavorites) =>
        currentFavorites.filter((item) => (item._id || item.id) !== favoriteId),
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove favorite",
      );
    } finally {
      setRemovingId("");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (!isLoggedIn) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <h1>Favorites</h1>
            <p>Login to save and manage your favorite football items.</p>
          </div>
        </div>

        <div className="auth-required-card">
          <h2>Login required</h2>
          <p>You need to login before saving teams, leagues, or players.</p>

          <div className="auth-required-actions">
            <Link to="/login" className="primary-button">
              Login
            </Link>

            <Link to="/register" className="secondary-button">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Favorites</h1>
          <p>Your saved teams, leagues, and players.</p>
        </div>
      </div>

      {loading && <LoadingState message="Loading favorites..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchFavorites} />
      )}

      {!loading && !error && favorites.length === 0 && (
        <EmptyState
          title="No favorites yet"
          message="Save teams, leagues, or players to see them here."
        />
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="favorites-layout">
          {groupedFavorites.players.length > 0 && (
            <section className="favorites-section">
              <h2>Players</h2>

              <div className="favorites-grid">
                {groupedFavorites.players.map((favorite) => (
                  <FavoriteCard
                    key={favorite._id || favorite.id}
                    favorite={favorite}
                    onRemove={handleRemoveFavorite}
                    disabled={removingId === (favorite._id || favorite.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedFavorites.teams.length > 0 && (
            <section className="favorites-section">
              <h2>Teams</h2>

              <div className="favorites-grid">
                {groupedFavorites.teams.map((favorite) => (
                  <FavoriteCard
                    key={favorite._id || favorite.id}
                    favorite={favorite}
                    onRemove={handleRemoveFavorite}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedFavorites.leagues.length > 0 && (
            <section className="favorites-section">
              <h2>Leagues</h2>

              <div className="favorites-grid">
                {groupedFavorites.leagues.map((favorite) => (
                  <FavoriteCard
                    key={favorite._id || favorite.id}
                    favorite={favorite}
                    onRemove={handleRemoveFavorite}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
};
