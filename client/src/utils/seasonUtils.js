const CALENDAR_YEAR_LEAGUE_IDS = new Set([
  253, // MLS
]);

export const getSeasonLabel = ({ season, leagueId }) => {
  const seasonNumber = Number(season);

  if (!seasonNumber) {
    return "";
  }

  if (CALENDAR_YEAR_LEAGUE_IDS.has(Number(leagueId))) {
    return String(seasonNumber);
  }

  return `${seasonNumber}/${seasonNumber + 1}`;
};

export const createFallbackSeasonOptions = ({ leagueId } = {}) => {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: 8 }, (_, index) => {
    const season = currentYear - index;

    return {
      value: season,
      label: getSeasonLabel({
        season,
        leagueId,
      }),
    };
  });
};
