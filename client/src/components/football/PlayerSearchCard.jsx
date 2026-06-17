import { Link } from "react-router-dom";

export const PlayerSearchCard = ({ item, season, leagueId }) => {
  const player = item.player;
  const context = item.currentContext;

  return (
    <Link
      to={`/players/${player.id}?season=${season}&league=${leagueId}`}
      className="search-card"
    >
      <div className="search-card-media">
        {player.photo && (
          <img
            src={player.photo}
            alt={player.name}
            className="search-card-photo"
          />
        )}
      </div>

      <div className="search-card-content">
        <h3>
          {player.firstname && player.lastname
            ? `${player.firstname} ${player.lastname}`
            : player.name}
        </h3>

        <p>
          {context?.team?.name || "Unknown team"}
          {context?.position ? ` • ${context.position}` : ""}
        </p>

        <span>
          {player.nationality || "Unknown nationality"}
          {context?.league?.name ? ` • ${context.league.name}` : ""}
        </span>
      </div>
    </Link>
  );
};

/* It displays:

player photo
player name
nationality
age
team name
position

Clicking it navigates to:

/players/:playerId */
