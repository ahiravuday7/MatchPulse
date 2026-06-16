// Finished Match Support , This function filters only completed matches:
const FINISHED_STATUS_CODES = ["FT", "AET", "PEN"];

export const filterFinishedFixtures = (fixtures = []) => {
  return fixtures.filter((fixture) =>
    FINISHED_STATUS_CODES.includes(fixture.fixture.status.short),
  );
};

// This function groups API-Football raw fixtures by league.
export const groupFixturesByLeague = (fixtures = []) => {
  const grouped = {};

  fixtures.forEach((fixture) => {
    const leagueId = fixture.league.id;

    if (!grouped[leagueId]) {
      grouped[leagueId] = {
        league: {
          id: fixture.league.id,
          name: fixture.league.name,
          country: fixture.league.country,
          logo: fixture.league.logo,
          flag: fixture.league.flag,
          season: fixture.league.season,
          round: fixture.league.round,
        },
        fixtures: [],
      };
    }

    grouped[leagueId].fixtures.push({
      id: fixture.fixture.id,
      date: fixture.fixture.date,
      timestamp: fixture.fixture.timestamp,
      status: fixture.fixture.status,
      venue: fixture.fixture.venue,
      teams: fixture.teams,
      goals: fixture.goals,
      score: fixture.score,
    });
  });

  return Object.values(grouped);
};
