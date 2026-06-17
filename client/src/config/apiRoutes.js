const encodeQuery = (query) => encodeURIComponent(query.trim());

export const API_ROUTES = {
  health: "/health",

  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
    profile: "/auth/profile",
    account: "/auth/account",
  },

  football: {
    seasons: "/football/seasons",

    leagueSeasons: (leagueId) => `/football/leagues/${leagueId}/seasons`,

    liveMatches: "/football/matches/live",
    todayFixtures: "/football/fixtures/today",
    finishedMatches: "/football/matches/finished",

    matchDetails: (matchId) => `/football/matches/${matchId}`,

    leagueStandings: (leagueId, season) =>
      `/football/leagues/${leagueId}/standings?season=${season}`,

    teamDetails: (teamId, season) =>
      `/football/teams/${teamId}?season=${season}`,

    teamSquad: (teamId) => `/football/teams/${teamId}/squad`,

    teamPlayers: (teamId, season, limit = 50) =>
      `/football/teams/${teamId}/players?season=${season}&limit=${limit}`,

    search: (query, type = "all", limit = 10) =>
      `/football/search?q=${query}&type=${type}&limit=${limit}`,

    playerSearch: ({ query, season, leagueId = 39, limit = 10 }) =>
      `/football/players/search?q=${encodeQuery(
        query,
      )}&season=${season}&league=${leagueId}&limit=${limit}`,

    playerDetails: (playerId, season) =>
      `/football/players/${playerId}?season=${season}`,
  },

  favorites: {
    list: "/favorites",
    add: "/favorites",
    sync: "/favorites/sync",
    remove: (favoriteId) => `/favorites/${favoriteId}`,
  },

  usage: {
    today: "/usage/today",
  },
};
