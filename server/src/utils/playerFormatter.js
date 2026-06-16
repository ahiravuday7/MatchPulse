const getPrimaryStatistic = (statistics = []) => {
  return statistics?.[0] || null;
};

const formatPlayerProfile = (player) => ({
  id: player.id,
  name: player.name,
  firstname: player.firstname,
  lastname: player.lastname,
  age: player.age,
  birth: player.birth,
  nationality: player.nationality,
  height: player.height,
  weight: player.weight,
  injured: player.injured,
  photo: player.photo,
});

const formatStatistic = (statistic) => {
  if (!statistic) return null;

  return {
    team: statistic.team
      ? {
          id: statistic.team.id,
          name: statistic.team.name,
          logo: statistic.team.logo,
        }
      : null,

    league: statistic.league
      ? {
          id: statistic.league.id,
          name: statistic.league.name,
          country: statistic.league.country,
          logo: statistic.league.logo,
          flag: statistic.league.flag,
          season: statistic.league.season,
        }
      : null,

    games: statistic.games || {},
    substitutes: statistic.substitutes || {},
    shots: statistic.shots || {},
    goals: statistic.goals || {},
    passes: statistic.passes || {},
    tackles: statistic.tackles || {},
    duels: statistic.duels || {},
    dribbles: statistic.dribbles || {},
    fouls: statistic.fouls || {},
    cards: statistic.cards || {},
    penalty: statistic.penalty || {},
  };
};

export const formatPlayerSearchResults = (apiResponse, limit = 10) => {
  const results = apiResponse?.response || [];

  return results.slice(0, limit).map((item) => {
    const primaryStatistic = getPrimaryStatistic(item.statistics);

    return {
      player: formatPlayerProfile(item.player),

      currentContext: primaryStatistic
        ? {
            team: primaryStatistic.team
              ? {
                  id: primaryStatistic.team.id,
                  name: primaryStatistic.team.name,
                  logo: primaryStatistic.team.logo,
                }
              : null,

            league: primaryStatistic.league
              ? {
                  id: primaryStatistic.league.id,
                  name: primaryStatistic.league.name,
                  country: primaryStatistic.league.country,
                  logo: primaryStatistic.league.logo,
                  season: primaryStatistic.league.season,
                }
              : null,

            position: primaryStatistic.games?.position || null,
            rating: primaryStatistic.games?.rating || null,
          }
        : null,
    };
  });
};

export const formatPlayerDetails = (apiResponse) => {
  const item = apiResponse?.response?.[0];

  if (!item) return null;

  return {
    player: formatPlayerProfile(item.player),

    statistics: (item.statistics || []).map(formatStatistic),
  };
};

export const formatTeamPlayers = (apiResponse, limit = 50) => {
  const results = apiResponse?.response || [];

  const players = results.slice(0, limit).map((item) => {
    const primaryStatistic = getPrimaryStatistic(item.statistics);

    return {
      player: formatPlayerProfile(item.player),

      position: primaryStatistic?.games?.position || null,
      number: primaryStatistic?.games?.number || null,
      rating: primaryStatistic?.games?.rating || null,

      statistics: primaryStatistic ? formatStatistic(primaryStatistic) : null,
    };
  });

  return {
    count: players.length,
    players,
  };
};
