import { Link } from "react-router-dom";

const getScoreValue = (score) => {
  return score === null || score === undefined ? "-" : score;
};

export const MatchCard = ({ fixture }) => {
  const fixtureInfo = fixture.fixture;
  const teams = fixture.teams;
  const goals = fixture.goals;
  const status = fixtureInfo?.status;

  return (
    <Link to={`/matches/${fixtureInfo.id}`} className="match-card">
      <div className="match-status-row">
        <span className="match-minute">
          {status?.elapsed ? `${status.elapsed}'` : status?.short}
        </span>

        <span className="match-status">{status?.long}</span>
      </div>

      <div className="team-row">
        <div className="team-info">
          {teams?.home?.logo && (
            <img
              src={teams.home.logo}
              alt={teams.home.name}
              className="team-logo"
            />
          )}
          <span>{teams?.home?.name}</span>
        </div>

        <strong>{getScoreValue(goals?.home)}</strong>
      </div>

      <div className="team-row">
        <div className="team-info">
          {teams?.away?.logo && (
            <img
              src={teams.away.logo}
              alt={teams.away.name}
              className="team-logo"
            />
          )}
          <span>{teams?.away?.name}</span>
        </div>

        <strong>{getScoreValue(goals?.away)}</strong>
      </div>

      {fixtureInfo?.venue?.name && (
        <p className="match-venue">{fixtureInfo.venue.name}</p>
      )}
    </Link>
  );
};

// This component displays one match.
// So when user clicks a match card, later it will open the match details page.
