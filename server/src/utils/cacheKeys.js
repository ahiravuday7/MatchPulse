const normalizeSearchQuery = (query) =>
  encodeURIComponent(query.trim().toLowerCase());

export const cacheKeys = {
  liveMatches: () => "live-matches",

  todayFixtures: (date) => `today-fixtures-${date}`,

  finishedMatches: (date) => `finished-matches-${date}`,

  matchDetails: (matchId) => `match-details-${matchId}`,

  leagueStandings: (leagueId, season) =>
    `league-standings-${leagueId}-${season}`,

  teamDetails: (teamId, season) => `team-details-${teamId}-${season}`,

  searchTeams: (query) => `search-teams-${normalizeSearchQuery(query)}`,

  searchLeagues: (query) => `search-leagues-${normalizeSearchQuery(query)}`,

  teamSquad: (teamId) => `team-squad-${teamId}`,

  searchPlayers: (query, season) =>
    `search-players-${normalizeSearchQuery(query)}-${season}`,

  playerDetails: (playerId, season) => `player-details-${playerId}-${season}`,

  teamPlayers: (teamId, season) => `team-players-${teamId}-${season}`,
};
// Create consistent cache keys
// This creates a unique cache key for each date.
