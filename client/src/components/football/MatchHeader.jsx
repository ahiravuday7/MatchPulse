const getScoreValue = (score) => {
  return score === null || score === undefined ? "-" : score;
};

const formatMatchDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const MatchHeader = ({ match }) => {
  const fixture = match?.fixture;
  const league = match?.league;
  const teams = match?.teams;
  const goals = match?.goals;

  const status = fixture?.status;
  const venue = fixture?.venue;

  return (
    <section className="match-details-hero">
      <div className="match-details-league">
        {league?.logo && (
          <img src={league.logo} alt={league.name} className="league-logo" />
        )}

        <div>
          <p>{league?.name}</p>
          <span>{league?.country}</span>
        </div>
      </div>

      <div className="match-details-scoreboard">
        <div className="match-details-team">
          {teams?.home?.logo && (
            <img
              src={teams.home.logo}
              alt={teams.home.name}
              className="match-details-team-logo"
            />
          )}

          <h2>{teams?.home?.name}</h2>
        </div>

        <div className="match-score-center">
          <div className="match-scoreline">
            <span>{getScoreValue(goals?.home)}</span>
            <strong>-</strong>
            <span>{getScoreValue(goals?.away)}</span>
          </div>

          <p className="match-status-label">{status?.long}</p>

          {status?.elapsed && (
            <span className="match-minute-large">{status.elapsed}'</span>
          )}
        </div>

        <div className="match-details-team">
          {teams?.away?.logo && (
            <img
              src={teams.away.logo}
              alt={teams.away.name}
              className="match-details-team-logo"
            />
          )}

          <h2>{teams?.away?.name}</h2>
        </div>
      </div>

      <div className="match-meta-row">
        {fixture?.date && <span>{formatMatchDate(fixture.date)}</span>}

        {venue?.name && (
          <span>
            {venue.name}
            {venue.city ? `, ${venue.city}` : ""}
          </span>
        )}

        {league?.round && <span>{league.round}</span>}
      </div>
    </section>
  );
};

/* This component shows the top scoreboard section.

It displays:

League logo
League name
Country
Home team logo/name
Away team logo/name
Score
Match status
Elapsed minute
Venue
Date
Round */
