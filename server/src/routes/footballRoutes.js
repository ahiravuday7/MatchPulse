import express from "express";
import {
  getLiveMatchesController,
  getTodayFixturesController,
  getFinishedMatchesController,
  getMatchDetailsController,
  getLeagueStandingsController,
  getTeamDetailsController,
  searchFootballController,
  getTeamSquadController,
  searchPlayersController,
  getPlayerDetailsController,
  getTeamPlayersController,
} from "../controllers/footballController.js";
import { validateRequest } from "../middleware/validateRequest.js";

import {
  matchIdValidator,
  leagueStandingsValidator,
  teamDetailsValidator,
  footballSearchValidator,
  teamSquadValidator,
  playerSearchValidator,
  playerDetailsValidator,
  teamPlayersValidator,
} from "../validators/footballValidators.js";

import { searchLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get(
  "/search",
  searchLimiter,
  footballSearchValidator,
  validateRequest,
  searchFootballController,
);
router.get(
  "/players/search",
  playerSearchValidator,
  validateRequest,
  searchPlayersController,
);

router.get(
  "/players/:playerId",
  playerDetailsValidator,
  validateRequest,
  getPlayerDetailsController,
);
router.get("/matches/live", getLiveMatchesController);
router.get("/fixtures/today", getTodayFixturesController);
router.get("/matches/finished", getFinishedMatchesController);

router.get(
  "/matches/:matchId",
  matchIdValidator,
  validateRequest,
  getMatchDetailsController,
);

router.get(
  "/leagues/:leagueId/standings",
  leagueStandingsValidator,
  validateRequest,
  getLeagueStandingsController,
);

router.get(
  "/teams/:teamId/players",
  teamPlayersValidator,
  validateRequest,
  getTeamPlayersController,
);

router.get(
  "/teams/:teamId",
  teamDetailsValidator,
  validateRequest,
  getTeamDetailsController,
);

router.get(
  "/teams/:teamId/squad",
  teamSquadValidator,
  validateRequest,
  getTeamSquadController,
);

export default router;

//Routes define endpoint URLs.
