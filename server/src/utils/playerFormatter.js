const getPrimaryStatistic = (statistics = []) => {
  return statistics?.[0] || null;
};

const getNumber = (value) => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
};

const getAverageRating = (statistics = []) => {
  const ratings = statistics
    .map((statistic) => Number(statistic.games?.rating))
    .filter((rating) => !Number.isNaN(rating));

  if (!ratings.length) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);

  return (total / ratings.length).toFixed(2);
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

const createPlayerSummary = (statistics = []) => {
  const primaryStatistic = getPrimaryStatistic(statistics);

  return {
    team: primaryStatistic?.team || null,
    league: primaryStatistic?.league || null,
    position: primaryStatistic?.games?.position || null,

    appearances: statistics.reduce(
      (sum, statistic) => sum + getNumber(statistic.games?.appearences),
      0,
    ),

    starts: statistics.reduce(
      (sum, statistic) => sum + getNumber(statistic.games?.lineups),
      0,
    ),

    minutes: statistics.reduce(
      (sum, statistic) => sum + getNumber(statistic.games?.minutes),
      0,
    ),

    goals: statistics.reduce(
      (sum, statistic) => sum + getNumber(statistic.goals?.total),
      0,
    ),

    assists: statistics.reduce(
      (sum, statistic) => sum + getNumber(statistic.goals?.assists),
      0,
    ),

    yellowCards: statistics.reduce(
      (sum, statistic) => sum + getNumber(statistic.cards?.yellow),
      0,
    ),

    redCards: statistics.reduce(
      (sum, statistic) => sum + getNumber(statistic.cards?.red),
      0,
    ),

    rating: getAverageRating(statistics),
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

  if (!item) {
    return null;
  }

  const statistics = (item.statistics || []).map(formatStatistic);

  return {
    player: formatPlayerProfile(item.player),
    summary: createPlayerSummary(statistics),
    statistics,
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
