export const formatTeamSearchResults = (apiResponse, limit = 10) => {
  const results = apiResponse?.response || [];

  return results.slice(0, limit).map((item) => ({
    id: item.team.id,
    name: item.team.name,
    code: item.team.code,
    country: item.team.country,
    founded: item.team.founded,
    national: item.team.national,
    logo: item.team.logo,

    venue: item.venue
      ? {
          id: item.venue.id,
          name: item.venue.name,
          city: item.venue.city,
          capacity: item.venue.capacity,
          image: item.venue.image,
        }
      : null,
  }));
};

export const formatLeagueSearchResults = (apiResponse, limit = 10) => {
  const results = apiResponse?.response || [];

  return results.slice(0, limit).map((item) => {
    const seasons = item.seasons || [];

    const currentSeason =
      seasons.find((season) => season.current) ||
      seasons[seasons.length - 1] ||
      null;

    return {
      id: item.league.id,
      name: item.league.name,
      type: item.league.type,
      logo: item.league.logo,

      country: {
        name: item.country?.name || null,
        code: item.country?.code || null,
        flag: item.country?.flag || null,
      },

      currentSeason: currentSeason
        ? {
            year: currentSeason.year,
            start: currentSeason.start,
            end: currentSeason.end,
            current: currentSeason.current,
          }
        : null,
    };
  });
};
