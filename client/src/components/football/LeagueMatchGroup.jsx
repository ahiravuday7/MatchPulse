import { MatchCard } from "./MatchCard";

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

        <span className="match-count">{fixtures.length} match</span>
      </div>

      <div className="match-grid">
        {fixtures.map((fixture) => (
          <MatchCard key={fixture.fixture.id} fixture={fixture} />
        ))}
      </div>
    </section>
  );
};
// This component groups matches under one league.
// This makes the UI cleaner instead of showing all matches in one long list.
