import { getCache, setCache, getOrSetCache } from "./cacheService.js"; //This imports reusable cache logic.
import {
  getLiveFixturesFromApi,
  getFixturesByDateFromApi,
  getMatchDetailsFromApi,
  getLeagueStandingsFromApi,
  getTeamInfoFromApi,
  getTeamFixturesFromApi,
  searchTeamsFromApi,
  searchLeaguesFromApi,
  getTeamSquadFromApi,
  searchPlayersFromApi,
  getPlayerDetailsFromApi,
  getTeamPlayersFromApi,
  getAvailableSeasonsFromApi,
  getLeagueSeasonsFromApi,
} from "./apiFootballService.js"; //This imports the function that calls API-Football.
//These are used to define:which cache key to use, how long data should stay cached
import { cacheKeys } from "../utils/cacheKeys.js";
import { CACHE_DURATIONS } from "../utils/cacheDurations.js";
import { getTodayDate } from "../utils/dateUtils.js";
import {
  groupFixturesByLeague,
  filterFinishedFixtures,
} from "../utils/fixtureFormatter.js";
import { isFinishedMatch } from "../utils/matchUtils.js";
import { formatLeagueStandings } from "../utils/leagueFormatter.js";
import { formatTeamDetails } from "../utils/teamFormatter.js";
import {
  formatTeamSearchResults,
  formatLeagueSearchResults,
} from "../utils/searchFormatter.js";
import { formatTeamSquad } from "../utils/squadFormatter.js";
import {
  formatPlayerSearchResults,
  formatPlayerDetails,
  formatTeamPlayers,
} from "../utils/playerFormatter.js";
import {
  formatSeasonOptions,
  formatLeagueSeasons,
} from "../utils/seasonFormatter.js";

//This function is called by the controller.
export const getLiveMatches = async () => {
  return getOrSetCache({
    key: cacheKeys.liveMatches(),
    type: "LIVE_MATCHES",
    ttlSeconds: CACHE_DURATIONS.LIVE_MATCHES,
    fetchFreshData: getLiveFixturesFromApi,
  });
};

// 1. Get today date,2. Create cache key,3. Check MongoDB cache,4. If valid cache exists, return cache,5. If not, call API-Football,6. Group fixtures by league,7. Return final data
export const getTodayFixtures = async () => {
  const today = getTodayDate();

  const result = await getOrSetCache({
    key: cacheKeys.todayFixtures(today),
    type: "TODAY_FIXTURES",
    ttlSeconds: CACHE_DURATIONS.TODAY_FIXTURES,
    fetchFreshData: () => getFixturesByDateFromApi(today),
  });

  return {
    source: result.source,
    date: today,
    data: groupFixturesByLeague(result.data.response),
  };
};

// finished matches service.
export const getFinishedMatches = async () => {
  const today = getTodayDate();

  const result = await getOrSetCache({
    key: cacheKeys.finishedMatches(today),
    type: "FINISHED_MATCHES",
    ttlSeconds: CACHE_DURATIONS.FINISHED_MATCHES,
    fetchFreshData: () => getFixturesByDateFromApi(today),
  });

  const finishedFixtures = filterFinishedFixtures(result.data.response);

  return {
    source: result.source,
    date: today,
    data: groupFixturesByLeague(finishedFixtures),
  };
};

// MatchDetails , dynamic cache duration
export const getMatchDetails = async (matchId) => {
  const cacheKey = cacheKeys.matchDetails(matchId);

  const cached = await getCache(cacheKey);

  if (cached) {
    return {
      source: "cache",
      data: cached,
    };
  }

  const freshData = await getMatchDetailsFromApi(matchId);

  const isFinished = isFinishedMatch(freshData.fixture);

  const ttlSeconds = isFinished
    ? CACHE_DURATIONS.MATCH_DETAILS_FINISHED
    : CACHE_DURATIONS.MATCH_DETAILS_LIVE;

  await setCache({
    key: cacheKey,
    type: "MATCH_DETAILS",
    data: freshData,
    ttlSeconds,
  });

  return {
    source: "api",
    data: freshData,
  };
};

// Check cache first,If data exists → return cache,If not → call API,Save API response in cache for 12 hours,Return formatted data
export const getLeagueStandings = async (leagueId, season) => {
  const result = await getOrSetCache({
    key: cacheKeys.leagueStandings(leagueId, season),

    type: "LEAGUE_STANDINGS",

    ttlSeconds: CACHE_DURATIONS.LEAGUE_STANDINGS,

    fetchFreshData: () => getLeagueStandingsFromApi(leagueId, season),
  });

  return {
    source: result.source,
    data: formatLeagueStandings(result.data),
  };
};

// Team Details Endpoint + Team Fixtures
export const getTeamDetails = async (teamId, season) => {
  const result = await getOrSetCache({
    key: cacheKeys.teamDetails(teamId, season),
    type: "TEAM_DATA",
    ttlSeconds: CACHE_DURATIONS.TEAM_DATA,
    fetchFreshData: async () => {
      const [teamInfoResponse, fixturesResponse] = await Promise.all([
        getTeamInfoFromApi(teamId),
        getTeamFixturesFromApi(teamId, season),
      ]);

      return {
        teamInfoResponse,
        fixturesResponse,
      };
    },
  });

  return {
    source: result.source,
    season,
    data: formatTeamDetails(result.data),
  };
};

// search service:
export const searchFootball = async ({ query, type = "all", limit = 10 }) => {
  const searchTerm = query.trim();

  const shouldSearchTeams = type === "all" || type === "team";

  const shouldSearchLeagues = type === "all" || type === "league";

  const teamsPromise = shouldSearchTeams
    ? getOrSetCache({
        key: cacheKeys.searchTeams(searchTerm),
        type: "TEAM_SEARCH",
        ttlSeconds: CACHE_DURATIONS.SEARCH_RESULTS,
        fetchFreshData: () => searchTeamsFromApi(searchTerm),
      })
    : Promise.resolve(null);

  const leaguesPromise = shouldSearchLeagues
    ? getOrSetCache({
        key: cacheKeys.searchLeagues(searchTerm),
        type: "LEAGUE_SEARCH",
        ttlSeconds: CACHE_DURATIONS.SEARCH_RESULTS,
        fetchFreshData: () => searchLeaguesFromApi(searchTerm),
      })
    : Promise.resolve(null);

  const [teamsResult, leaguesResult] = await Promise.all([
    teamsPromise,
    leaguesPromise,
  ]);

  const teams = teamsResult
    ? formatTeamSearchResults(teamsResult.data, limit)
    : [];

  const leagues = leaguesResult
    ? formatLeagueSearchResults(leaguesResult.data, limit)
    : [];

  return {
    query: searchTerm,
    type,
    sources: {
      teams: teamsResult?.source || null,
      leagues: leaguesResult?.source || null,
    },
    counts: {
      teams: teams.length,
      leagues: leagues.length,
      total: teams.length + leagues.length,
    },
    data: {
      teams,
      leagues,
    },
  };
};

// Team Squad
export const getTeamSquad = async (teamId) => {
  const result = await getOrSetCache({
    key: cacheKeys.teamSquad(teamId),
    type: "TEAM_SQUAD",
    ttlSeconds: CACHE_DURATIONS.TEAM_SQUAD,
    fetchFreshData: () => getTeamSquadFromApi(teamId),
  });

  return {
    source: result.source,
    data: formatTeamSquad(result.data),
  };
};

// players
export const searchPlayers = async ({
  query,
  season,
  leagueId,
  limit = 10,
}) => {
  const searchTerm = query.trim();

  const result = await getOrSetCache({
    key: cacheKeys.searchPlayers(searchTerm, season, leagueId || "all"),
    type: "PLAYER_SEARCH",
    ttlSeconds: CACHE_DURATIONS.PLAYER_SEARCH,
    fetchFreshData: () =>
      searchPlayersFromApi({
        query: searchTerm,
        season,
        leagueId,
      }),
  });

  const players = formatPlayerSearchResults(result.data, limit);

  return {
    source: result.source,
    query: searchTerm,
    season,
    leagueId: leagueId || null,
    count: players.length,
    data: players,
  };
};

export const getPlayerDetails = async ({ playerId, season }) => {
  const result = await getOrSetCache({
    key: cacheKeys.playerDetails(playerId, season),
    type: "PLAYER_DETAILS",
    ttlSeconds: CACHE_DURATIONS.PLAYER_DETAILS,
    fetchFreshData: () =>
      getPlayerDetailsFromApi({
        playerId,
        season,
      }),
  });

  return {
    source: result.source,
    season,
    data: formatPlayerDetails(result.data),
  };
};

export const getTeamPlayers = async ({ teamId, season, limit = 50 }) => {
  const result = await getOrSetCache({
    key: cacheKeys.teamPlayers(teamId, season),
    type: "TEAM_PLAYERS",
    ttlSeconds: CACHE_DURATIONS.TEAM_PLAYERS,
    fetchFreshData: () =>
      getTeamPlayersFromApi({
        teamId,
        season,
      }),
  });

  return {
    source: result.source,
    season,
    data: formatTeamPlayers(result.data, limit),
  };
};

export const getAvailableSeasons = async () => {
  const result = await getOrSetCache({
    key: cacheKeys.seasons(),
    type: "SEASONS",
    ttlSeconds: CACHE_DURATIONS.SEASONS,
    fetchFreshData: getAvailableSeasonsFromApi,
  });

  const seasons = formatSeasonOptions({
    seasons: result.data?.response || [],
  });

  return {
    source: result.source,
    count: seasons.length,
    data: seasons,
  };
};

export const getLeagueSeasons = async (leagueId) => {
  const result = await getOrSetCache({
    key: cacheKeys.leagueSeasons(leagueId),
    type: "LEAGUE_SEASONS",
    ttlSeconds: CACHE_DURATIONS.LEAGUE_SEASONS,
    fetchFreshData: () => getLeagueSeasonsFromApi(leagueId),
  });

  const formattedData = formatLeagueSeasons({
    leagueResponse: result.data,
    leagueId,
  });

  return {
    source: result.source,
    data: formattedData,
  };
};
// This file contains business logic.
//Check MongoDB cache using key football:matches:live

// If cache exists and not expired:
//   return cached data

// If cache missing or expired:
//   call API-Football
//   save fresh data in MongoDB cache
//   return fresh data

// So this service protects your 100 requests/day limit.
