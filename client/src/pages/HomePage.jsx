export const HomePage = () => {
  return (
    <section className="page">
      <h1>MatchPulse</h1>
      <p>Live football scores, fixtures, teams, players, and favorites.</p>

      <div className="card-grid">
        <div className="card">
          <h2>Live Matches</h2>
          <p>Track live football matches.</p>
        </div>

        <div className="card">
          <h2>Fixtures</h2>
          <p>View today’s fixtures grouped by league.</p>
        </div>

        <div className="card">
          <h2>Players</h2>
          <p>Search players and view season statistics.</p>
        </div>
      </div>
    </section>
  );
};
