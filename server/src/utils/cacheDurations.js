// Cache Utility Files
// Keep all cache expiry times in one place
export const CACHE_DURATIONS = {
  LIVE_MATCHES: 60, // 1 minute

  MATCH_DETAILS_LIVE: 5 * 60, // 5 minutes
  MATCH_DETAILS_FINISHED: 24 * 60 * 60, // 24 hours

  FINISHED_MATCHES: 10 * 60, // 10 minutes
  TODAY_FIXTURES: 10 * 60, // 10 minutes

  LEAGUE_STANDINGS: 12 * 60 * 60, // 12 hours

  TEAM_DATA: 24 * 60 * 60, // 24 hours
  TEAM_SQUAD: 24 * 60 * 60,

  SEARCH_RESULTS: 24 * 60 * 60,

  PLAYER_SEARCH: 24 * 60 * 60,
  PLAYER_DETAILS: 24 * 60 * 60,
  TEAM_PLAYERS: 24 * 60 * 60,

  SEASONS: 7 * 24 * 60 * 60,
  LEAGUE_SEASONS: 7 * 24 * 60 * 60,
};
