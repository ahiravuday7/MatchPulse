import {
  getLiveMatches,
  getTodayFixtures,
  getFinishedMatches,
  getMatchDetails,
  getLeagueStandings,
  getTeamDetails,
  searchFootball,
  getTeamSquad,
  searchPlayers,
  getPlayerDetails,
  getTeamPlayers,
  getAvailableSeasons,
  getLeagueSeasons,
} from "../services/footballService.js";

import { asyncHandler } from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getLiveMatchesController = asyncHandler(async (req, res) => {
  const result = await getLiveMatches();

  res.status(200).json({
    success: true,
    source: result.source,
    data: result.data,
  });
});

export const getTodayFixturesController = asyncHandler(async (req, res) => {
  const result = await getTodayFixtures();

  res.status(200).json({
    success: true,
    source: result.source,
    date: result.date,
    leagues: result.data,
  });
});

export const getFinishedMatchesController = asyncHandler(async (req, res) => {
  const result = await getFinishedMatches();

  res.status(200).json({
    success: true,
    source: result.source,
    date: result.date,
    leagues: result.data,
  });
});

export const getMatchDetailsController = asyncHandler(async (req, res) => {
  const { matchId } = req.params;

  if (!Number(matchId)) {
    throw new AppError("Invalid match ID", 400);
  }

  const result = await getMatchDetails(matchId);

  res.status(200).json({
    success: true,
    source: result.source,
    data: result.data,
  });
});

export const getLeagueStandingsController = asyncHandler(async (req, res) => {
  const { leagueId } = req.params;

  if (!Number(leagueId)) {
    throw new AppError("Invalid league ID", 400);
  }

  const season = Number(req.query.season) || 2024;

  const result = await getLeagueStandings(leagueId, season);

  if (!result.data) {
    return res.status(200).json({
      success: true,
      source: result.source,
      message: "No standings available for this league and season",
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    source: result.source,
    season,
    data: result.data,
  });
});

export const getTeamDetailsController = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  if (!Number(teamId)) {
    throw new AppError("Invalid team ID", 400);
  }

  const season = Number(req.query.season) || 2024;

  const result = await getTeamDetails(teamId, season);

  if (!result.data) {
    return res.status(200).json({
      success: true,
      source: result.source,
      season,
      message: "No team data available for this team and season",
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    source: result.source,
    season: result.season,
    data: result.data,
  });
});

export const searchFootballController = asyncHandler(async (req, res) => {
  const { q, type = "all", limit = 10 } = req.query;

  const result = await searchFootball({
    query: q,
    type,
    limit: Number(limit),
  });

  res.status(200).json({
    success: true,
    query: result.query,
    type: result.type,
    sources: result.sources,
    counts: result.counts,
    data: result.data,
  });
});

export const getTeamSquadController = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const result = await getTeamSquad(teamId);

  if (!result.data) {
    return res.status(200).json({
      success: true,
      source: result.source,
      message: "No squad data available for this team",
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    source: result.source,
    data: result.data,
  });
});

// player
export const searchPlayersController = asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;

  const result = await searchPlayers({
    query: q,
    limit: Number(limit),
  });

  res.status(200).json({
    success: true,
    source: result.source,
    query: result.query,
    count: result.count,
    data: result.data,
  });
});

export const getPlayerDetailsController = asyncHandler(async (req, res) => {
  const { playerId } = req.params;
  const season = Number(req.query.season) || 2024;

  const result = await getPlayerDetails({
    playerId,
    season,
  });

  if (!result.data) {
    return res.status(200).json({
      success: true,
      source: result.source,
      season,
      message: "No player data available for this player and season",
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    source: result.source,
    season: result.season,
    data: result.data,
  });
});

export const getTeamPlayersController = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const season = Number(req.query.season) || 2024;
  const limit = Number(req.query.limit) || 50;

  const result = await getTeamPlayers({
    teamId,
    season,
    limit,
  });

  res.status(200).json({
    success: true,
    source: result.source,
    season: result.season,
    data: result.data,
  });
});

export const getAvailableSeasonsController = asyncHandler(async (req, res) => {
  const result = await getAvailableSeasons();

  res.status(200).json({
    success: true,
    source: result.source,
    count: result.count,
    data: result.data,
  });
});

export const getLeagueSeasonsController = asyncHandler(async (req, res) => {
  const { leagueId } = req.params;

  const result = await getLeagueSeasons(leagueId);

  res.status(200).json({
    success: true,
    source: result.source,
    data: result.data,
  });
});
// Controller handles HTTP request and response.
// Controller does not call API-Football directly.It calls football service.
