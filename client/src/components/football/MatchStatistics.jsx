const parseStatValue = (value) => {
  if (value === null || value === undefined) return 0;

  if (typeof value === "number") return value;

  if (typeof value === "string") {
    return Number(value.replace("%", "")) || 0;
  }

  return 0;
};

const displayStatValue = (value) => {
  if (value === null || value === undefined) return "-";
  return value;
};

export const MatchStatistics = ({ statistics = [] }) => {
  if (statistics.length < 2) {
    return (
      <section className="details-panel">
        <h2>Statistics</h2>
        <p className="muted-text">No statistics available for this match.</p>
      </section>
    );
  }

  const homeStats = statistics[0];
  const awayStats = statistics[1];

  const statTypes = homeStats.statistics?.map((stat) => stat.type) || [];

  return (
    <section className="details-panel">
      <h2>Statistics</h2>

      <div className="stats-team-header">
        <span>{homeStats.team?.name}</span>
        <span>{awayStats.team?.name}</span>
      </div>

      <div className="stats-list">
        {statTypes.map((type) => {
          const homeStat = homeStats.statistics.find(
            (stat) => stat.type === type,
          );
          const awayStat = awayStats.statistics.find(
            (stat) => stat.type === type,
          );

          const homeValue = parseStatValue(homeStat?.value);
          const awayValue = parseStatValue(awayStat?.value);
          const total = homeValue + awayValue || 1;

          const homePercent = (homeValue / total) * 100;
          const awayPercent = (awayValue / total) * 100;

          return (
            <div key={type} className="stat-row">
              <div className="stat-values">
                <strong>{displayStatValue(homeStat?.value)}</strong>
                <span>{type}</span>
                <strong>{displayStatValue(awayStat?.value)}</strong>
              </div>

              <div className="stat-bars">
                <div className="stat-bar-track">
                  <div
                    className="stat-bar home-stat-bar"
                    style={{ width: `${homePercent}%` }}
                  />
                </div>

                <div className="stat-bar-track">
                  <div
                    className="stat-bar away-stat-bar"
                    style={{ width: `${awayPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* This component shows team statistics.

Examples:

Ball Possession
Shots on Goal
Total Shots
Corner Kicks
Fouls
Yellow Cards
Red Cards
Passes */
