import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { authService } from "../services/authService";
import { favoriteService } from "../services/favoriteService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

const quickLinks = [
  {
    title: "Live Matches",
    description: "Follow currently live football matches.",
    path: "/live",
    label: "Open Live",
  },
  {
    title: "Fixtures",
    description: "Check today's scheduled football fixtures.",
    path: "/fixtures",
    label: "View Fixtures",
  },
  {
    title: "Finished Matches",
    description: "Review recently completed match results.",
    path: "/finished",
    label: "View Results",
  },
  {
    title: "Search Football",
    description: "Search teams, leagues, and players.",
    path: "/search",
    label: "Start Search",
  },
];

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

  return "/favorites";
};

const DashboardFavoriteCard = ({ favorite }) => {
  return (
    <Link to={getFavoriteLink(favorite)} className="dashboard-favorite-card">
      <div className="dashboard-favorite-logo">
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
  );
};

export const HomePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = authService.isLoggedIn();
  const currentUser = authService.getCurrentUser();

  const groupedFavorites = useMemo(() => {
    return {
      players: favorites.filter((favorite) => favorite.type === "player"),
      teams: favorites.filter((favorite) => favorite.type === "team"),
      leagues: favorites.filter((favorite) => favorite.type === "league"),
    };
  }, [favorites]);

  const favoritePreview = favorites.slice(0, 6);

  const fetchFavorites = async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      setLoadingFavorites(true);
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
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <section className="page dashboard-page">
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-kicker">MatchPulse Dashboard</span>

          <h1>
            {isLoggedIn
              ? `Welcome back${currentUser?.name ? `, ${currentUser.name}` : ""}`
              : "Track football smarter with MatchPulse"}
          </h1>

          <p>
            Search football teams, leagues, players, follow match details, and
            manage your favorite football items from one place.
          </p>

          <div className="dashboard-hero-actions">
            <Link to="/search" className="primary-button">
              Search Football
            </Link>

            {isLoggedIn ? (
              <Link to="/favorites" className="secondary-button">
                View Favorites
              </Link>
            ) : (
              <Link to="/register" className="secondary-button">
                Create Account
              </Link>
            )}
          </div>
        </div>

        <div className="dashboard-summary-card">
          <h2>Favorites Summary</h2>

          {isLoggedIn ? (
            <div className="dashboard-summary-grid">
              <div>
                <strong>{groupedFavorites.players.length}</strong>
                <span>Players</span>
              </div>

              <div>
                <strong>{groupedFavorites.teams.length}</strong>
                <span>Teams</span>
              </div>

              <div>
                <strong>{groupedFavorites.leagues.length}</strong>
                <span>Leagues</span>
              </div>
            </div>
          ) : (
            <p>Login to save your favorite players, teams, and leagues.</p>
          )}
        </div>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Jump directly to the main football sections.</p>
          </div>
        </div>

        <div className="dashboard-quick-grid">
          {quickLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="dashboard-quick-card"
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>{item.label} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2>My Favorites</h2>
            <p>Your recently saved football items.</p>
          </div>

          {isLoggedIn && favorites.length > 0 && (
            <Link to="/favorites" className="secondary-button">
              Manage All
            </Link>
          )}
        </div>

        {!isLoggedIn && (
          <div className="dashboard-guest-card">
            <h3>Save your football world</h3>
            <p>
              Create an account to save players, teams, and leagues across
              MatchPulse.
            </p>

            <div className="dashboard-guest-actions">
              <Link to="/login" className="primary-button">
                Login
              </Link>

              <Link to="/register" className="secondary-button">
                Register
              </Link>
            </div>
          </div>
        )}

        {isLoggedIn && loadingFavorites && (
          <LoadingState message="Loading your favorites..." />
        )}

        {isLoggedIn && !loadingFavorites && error && (
          <ErrorState message={error} onRetry={fetchFavorites} />
        )}

        {isLoggedIn &&
          !loadingFavorites &&
          !error &&
          favorites.length === 0 && (
            <EmptyState
              title="No favorites yet"
              message="Search and save players, teams, or leagues to personalize your dashboard."
            />
          )}

        {isLoggedIn && !loadingFavorites && !error && favorites.length > 0 && (
          <div className="dashboard-favorites-grid">
            {favoritePreview.map((favorite) => (
              <DashboardFavoriteCard
                key={favorite._id || favorite.id}
                favorite={favorite}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
};
