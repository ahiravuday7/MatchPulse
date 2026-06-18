import { Link } from "react-router-dom";

export const PlayerSearchCard = ({ item }) => {
  const player = item.player;
  const context = item.currentContext;

  return (
    <Link to={`/players/${player.id}`} className="search-card">
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
        <h3>{player.name}</h3>

        <p>
          {context?.team?.name || "Unknown team"}
          {context?.position ? ` • ${context.position}` : ""}
        </p>

        <span>{player.age ? `${player.age} yrs` : "Footballer"}</span>
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
