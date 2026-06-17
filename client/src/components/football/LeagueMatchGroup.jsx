import { MatchCard } from "./MatchCard";

const getFixtureId = (fixture) => {
  return fixture.fixture?.id || fixture.id;
};

export const LeagueMatchGroup = ({ league, fixtures }) => {
  return (
    <section className="league-section">
      <div className="league-header">
        <div className="league-info">
          {league.logo && (
            <img src={league.logo} alt={league.name} className="league-logo" />
          )}

          <div>
            <h2>{league.name}</h2>
            <p>{league.country}</p>
          </div>
        </div>

        <span className="match-count">
          {fixtures.length} {fixtures.length === 1 ? "match" : "matches"}
        </span>
      </div>

      <div className="match-grid">
        {fixtures.map((fixture) => (
          <MatchCard key={getFixtureId(fixture)} fixture={fixture} />
        ))}
      </div>
    </section>
  );
};
// This component groups matches under one league.(This component renders one league section.)
// This makes the UI cleaner instead of showing all matches in one long list.
