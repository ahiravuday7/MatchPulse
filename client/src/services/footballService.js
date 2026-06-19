import { apiClient } from "./apiClient";
import { API_ROUTES } from "../config/apiRoutes";

export const footballService = {
  getLiveMatches: async () => {
    const response = await apiClient.get(API_ROUTES.football.liveMatches);

    return {
      source: response.data.source,
      fixtures: response.data.data?.response || [],
    };
  },

  getTodayFixtures: async () => {
    const response = await apiClient.get(API_ROUTES.football.todayFixtures);

    return {
      source: response.data.source,
      date: response.data.date,
      leagues: response.data.leagues || [],
    };
  },

  getFinishedMatches: async () => {
    const response = await apiClient.get(API_ROUTES.football.finishedMatches);

    return {
      source: response.data.source,
      date: response.data.date,
      leagues: response.data.leagues || [],
    };
  },

  getMatchDetails: async (matchId) => {
    const response = await apiClient.get(
      API_ROUTES.football.matchDetails(matchId),
    );

    return {
      source: response.data.source,
      data: response.data.data,
    };
  },

  getLeagueStandings: async ({ leagueId, season = 2024 }) => {
    const response = await apiClient.get(
      API_ROUTES.football.leagueStandings(leagueId, season),
    );

    return {
      source: response.data.source,
      season: response.data.season,
      data: response.data.data,
    };
  },

  getTeamDetails: async ({ teamId, season = 2024 }) => {
    const response = await apiClient.get(
      API_ROUTES.football.teamDetails(teamId, season),
    );

    return {
      source: response.data.source,
      season: response.data.season,
      data: response.data.data,
    };
  },

  searchFootball: async ({ query, type = "all", limit = 10 }) => {
    const response = await apiClient.get(
      API_ROUTES.football.search(query, type, limit),
    );

    return response.data;
  },

  searchPlayers: async ({ query, limit = 20 }) => {
    const response = await apiClient.get(
      API_ROUTES.football.playerSearch({
        query,
        limit,
      }),
    );

    return response.data;
  },

  getPlayerDetails: async ({ playerId, season = 2024, leagueId = "" }) => {
    const response = await apiClient.get(
      API_ROUTES.football.playerDetails(playerId, season, leagueId),
    );

    return {
      source: response.data.source,
      playerId: response.data.playerId,
      season: response.data.season,
      leagueId: response.data.leagueId,
      data: response.data.data,
    };
  },

  getAvailableSeasons: async () => {
    const response = await apiClient.get(API_ROUTES.football.seasons);

    return response.data;
  },

  getLeagueSeasons: async (leagueId) => {
    const response = await apiClient.get(
      API_ROUTES.football.leagueSeasons(leagueId),
    );

    return response.data;
  },

  getTeamSquad: async (teamId) => {
    const response = await apiClient.get(API_ROUTES.football.teamSquad(teamId));

    return {
      source: response.data.source,
      data: response.data.data,
    };
  },

  getTeamPlayers: async ({ teamId, season = 2024, limit = 50 }) => {
    const response = await apiClient.get(
      API_ROUTES.football.teamPlayers(teamId, season, limit),
    );

    return {
      source: response.data.source,
      season: response.data.season,
      data: response.data.data,
    };
  },
};

//This file is the frontend football API layer.
//all football API calls.
