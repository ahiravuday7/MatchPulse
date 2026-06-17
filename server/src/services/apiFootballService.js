import axios from "axios";
import { env } from "../config/env.js";

import { reserveApiRequest, markApiRequestResult } from "./apiUsageService.js";

// This creates a reusable Axios client.
const apiFootballClient = axios.create({
  baseURL: "https://v3.football.api-sports.io",

  headers: {
    "x-apisports-key": env.API_FOOTBALL_KEY,
  },

  timeout: 10000,
});

const safelyMarkRequestResult = async ({ dateKey, success, statusCode }) => {
  try {
    await markApiRequestResult({
      dateKey,
      success,
      statusCode,
    });
  } catch (trackingError) {
    /*
     * Tracking failure should be logged,
     * but it should not replace the original
     * API-Football response or error.
     */
    console.error(
      "[API USAGE] Failed to record request result:",
      trackingError.message,
    );
  }
};

/**
 * Central wrapper for every real API-Football call.
 *
 * Cache hits never reach this function.
 */
const requestApiFootball = async ({ url, params, usageKey }) => {
  const reservation = await reserveApiRequest(usageKey);

  try {
    const response = await apiFootballClient.get(url, {
      params,
    });

    await safelyMarkRequestResult({
      dateKey: reservation.dateKey,
      success: true,
      statusCode: response.status,
    });

    return response.data;
  } catch (error) {
    await safelyMarkRequestResult({
      dateKey: reservation.dateKey,
      success: false,
      statusCode: error.response?.status || null,
    });

    throw error;
  }
};

// This function is used to fetch live football matches.
export const getLiveFixturesFromApi = async () => {
  return requestApiFootball({
    url: "/fixtures",

    params: {
      live: "all",
    },

    usageKey: "fixtures_live",
  });
};

// This calls API-Football:
export const getFixturesByDateFromApi = async (date) => {
  return requestApiFootball({
    url: "/fixtures",

    params: {
      date,
    },

    usageKey: "fixtures_by_date",
  });
};

// Match Details
export const getMatchDetailsFromApi = async (matchId) => {
  const [fixtureResponse, eventsResponse, statisticsResponse] =
    await Promise.all([
      requestApiFootball({
        url: "/fixtures",

        params: {
          id: matchId,
        },

        usageKey: "fixture_details",
      }),

      requestApiFootball({
        url: "/fixtures/events",

        params: {
          fixture: matchId,
        },

        usageKey: "fixture_events",
      }),

      requestApiFootball({
        url: "/fixtures/statistics",

        params: {
          fixture: matchId,
        },

        usageKey: "fixture_statistics",
      }),
    ]);

  return {
    fixture: fixtureResponse.response?.[0] || null,

    events: eventsResponse.response || [],

    statistics: statisticsResponse.response || [],
  };
};

// This function directly calls API-Football: /standings?league=39&season=2025
export const getLeagueStandingsFromApi = async (leagueId, season) => {
  return requestApiFootball({
    url: "/standings",

    params: {
      league: leagueId,
      season,
    },

    usageKey: "standings",
  });
};

// Team Details Endpoint + Team Fixtures ,two API-Football calls.
export const getTeamInfoFromApi = async (teamId) => {
  return requestApiFootball({
    url: "/teams",

    params: {
      id: teamId,
    },

    usageKey: "team_info",
  });
};

export const getTeamFixturesFromApi = async (teamId, season) => {
  return requestApiFootball({
    url: "/fixtures",

    params: {
      team: teamId,
      season,
      next: 5,
      last: 5,
    },

    usageKey: "team_fixtures",
  });
};

// search
export const searchTeamsFromApi = async (query) => {
  return requestApiFootball({
    url: "/teams",

    params: {
      search: query,
    },

    usageKey: "team_search",
  });
};

export const searchLeaguesFromApi = async (query) => {
  return requestApiFootball({
    url: "/leagues",

    params: {
      search: query,
    },

    usageKey: "league_search",
  });
};

export const getTeamSquadFromApi = async (teamId) => {
  return requestApiFootball({
    url: "/players/squads",

    params: {
      team: teamId,
    },

    usageKey: "team_squad",
  });
};

// players
export const searchPlayersFromApi = async ({ query, season, leagueId }) => {
  const params = {
    search: query,
    season,
  };

  if (leagueId) {
    params.league = leagueId;
  }

  console.log("[PLAYER SEARCH API CALL]", params);

  return requestApiFootball({
    url: "/players",
    params,
    usageKey: "player_search",
  });
};

export const getPlayerDetailsFromApi = async ({ playerId, season }) => {
  return requestApiFootball({
    url: "/players",
    params: {
      id: playerId,
      season,
    },
    usageKey: "player_details",
  });
};

export const getTeamPlayersFromApi = async ({ teamId, season }) => {
  return requestApiFootball({
    url: "/players",
    params: {
      team: teamId,
      season,
    },
    usageKey: "team_players",
  });
};

export const getAvailableSeasonsFromApi = async () => {
  return requestApiFootball({
    url: "/leagues/seasons",
    params: {},
    usageKey: "seasons",
  });
};

export const getLeagueSeasonsFromApi = async (leagueId) => {
  return requestApiFootball({
    url: "/leagues",
    params: {
      id: leagueId,
    },
    usageKey: "league_seasons",
  });
};
// This file is responsible for calling the external API-Football server.
// axios → used to call external APIs
// env → used to access API_FOOTBALL_KEY from .env
