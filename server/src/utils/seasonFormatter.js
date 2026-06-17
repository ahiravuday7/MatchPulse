const CALENDAR_YEAR_LEAGUES = new Set([
  253, // MLS
]);

export const getSeasonLabel = ({ season, leagueId = null }) => {
  const seasonNumber = Number(season);

  if (!seasonNumber) {
    return "";
  }

  if (leagueId && CALENDAR_YEAR_LEAGUES.has(Number(leagueId))) {
    return String(seasonNumber);
  }

  return `${seasonNumber}/${seasonNumber + 1}`;
};

export const formatSeasonOptions = ({ seasons = [], leagueId = null }) => {
  return seasons
    .map((season) => Number(season))
    .filter(Boolean)
    .sort((a, b) => b - a)
    .map((season) => ({
      value: season,
      label: getSeasonLabel({ season, leagueId }),
    }));
};

export const formatLeagueSeasons = ({ leagueResponse, leagueId }) => {
  const leagueData = leagueResponse?.response?.[0];

  if (!leagueData) {
    return {
      league: null,
      seasons: [],
    };
  }

  const seasons = leagueData.seasons?.map((season) => season.year) || [];

  return {
    league: {
      id: leagueData.league?.id,
      name: leagueData.league?.name,
      type: leagueData.league?.type,
      logo: leagueData.league?.logo,
      country: {
        name: leagueData.country?.name,
        code: leagueData.country?.code,
        flag: leagueData.country?.flag,
      },
    },
    seasons: formatSeasonOptions({
      seasons,
      leagueId,
    }),
  };
};
