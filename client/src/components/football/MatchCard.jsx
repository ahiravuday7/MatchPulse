import { Link } from "react-router-dom";

// because upcoming fixtures may not have scores yet. So instead of showing blank or error, the card shows: -
const getScoreValue = (score) => {
  return score === null || score === undefined ? "-" : score;
};

const getFixtureInfo = (fixture) => {
  return fixture.fixture || fixture;
};

const formatKickoffTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const MatchCard = ({ fixture }) => {
  const fixtureInfo = getFixtureInfo(fixture);
  const teams = fixture.teams;
  const goals = fixture.goals;
  const status = fixtureInfo?.status;
  const venue = fixtureInfo?.venue;

  const matchId = fixtureInfo?.id;
  const kickoffTime = formatKickoffTime(fixtureInfo?.date);

  return (
    <Link to={`/matches/${matchId}`} className="match-card">
      <div className="match-status-row">
        <span className="match-minute">
          {status?.elapsed
            ? `${status.elapsed}'`
            : status?.short === "NS"
              ? kickoffTime
              : status?.short}
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

      {venue?.name && <p className="match-venue">{venue.name}</p>}
    </Link>
  );
};

// This component displays one match.
// So when user clicks a match card, later it will open the match details page.

// Live matches and today/finished matches do not return the exact same frontend structure.
// For live matches:fixture.fixture.id
// For today/finished matches:fixture.id
