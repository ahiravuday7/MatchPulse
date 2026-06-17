import { Link } from "react-router-dom";

export const TeamSearchCard = ({ team }) => {
  return (
    <Link to={`/teams/${team.id}`} className="search-card">
      <div className="search-card-media">
        {team.logo && (
          <img src={team.logo} alt={team.name} className="search-card-logo" />
        )}
      </div>

      <div className="search-card-content">
        <h3>{team.name}</h3>

        <p>{team.country || "Unknown country"}</p>

        {team.venue?.name && <span>{team.venue.name}</span>}
      </div>
    </Link>
  );
};

/* It displays:

team logo
team name
country
venue name

And clicking it navigates to:

/teams/:teamId */
