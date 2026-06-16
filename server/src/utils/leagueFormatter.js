export const formatLeagueStandings = (standingsResponse) => {
  const league = standingsResponse.response?.[0]?.league;

  if (!league) {
    return null;
  }

  return {
    league: {
      id: league.id,
      name: league.name,
      country: league.country,
      logo: league.logo,
      season: league.season,
    },

    standings: league.standings?.[0] || [],
  };
};

// Why formatter is needed?
// API-Football gives deeply nested data:
// response -> league -> standings -> standings
// But frontend needs simple data:
