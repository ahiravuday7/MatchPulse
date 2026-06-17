import { Link } from "react-router-dom";

export const LeagueSearchCard = ({ league }) => {
  const season = league.currentSeason?.year || 2024;

  return (
    <Link
      to={`/leagues/${league.id}/standings?season=${season}`}
      className="search-card"
    >
      <div className="search-card-media">
        {league.logo && (
          <img
            src={league.logo}
            alt={league.name}
            className="search-card-logo"
          />
        )}
      </div>

      <div className="search-card-content">
        <h3>{league.name}</h3>

        <p>{league.country?.name || "Unknown country"}</p>

        <span>
          {league.type}
          {league.currentSeason?.year
            ? ` • Season ${league.currentSeason.year}`
            : ""}
        </span>
      </div>
    </Link>
  );
};

/* It displays:

league logo
league name
country
type
current season

Clicking it navigates to:

/leagues/:leagueId/standings?season=2024 */
