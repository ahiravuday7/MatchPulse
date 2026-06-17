export const groupMatchesByLeague = (fixtures = []) => {
  const grouped = {};

  fixtures.forEach((fixture) => {
    const leagueId = fixture.league?.id || "unknown";

    if (!grouped[leagueId]) {
      grouped[leagueId] = {
        league: {
          id: fixture.league?.id,
          name: fixture.league?.name || "Unknown League",
          country: fixture.league?.country || "",
          logo: fixture.league?.logo || "",
          flag: fixture.league?.flag || "",
          season: fixture.league?.season,
          round: fixture.league?.round,
        },
        fixtures: [],
      };
    }

    grouped[leagueId].fixtures.push(fixture);
  });

  return Object.values(grouped);
};

// This helper takes flat match data and groups it by league.
