import { param, query } from "express-validator";

export const matchIdValidator = [
  param("matchId").isInt({ min: 1 }).withMessage("Invalid match ID"),
];

export const leagueStandingsValidator = [
  param("leagueId").isInt({ min: 1 }).withMessage("Invalid league ID"),

  query("season")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Invalid season"),
];

export const teamDetailsValidator = [
  param("teamId").isInt({ min: 1 }).withMessage("Invalid team ID"),

  query("season")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Invalid season"),
];

export const footballSearchValidator = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({
      min: 3,
      max: 50,
    })
    .withMessage("Search query must be between 3 and 50 characters"),

  query("type")
    .optional()
    .isIn(["all", "team", "league"])
    .withMessage("Search type must be all, team or league"),

  query("limit")
    .optional()
    .isInt({
      min: 1,
      max: 20,
    })
    .withMessage("Limit must be between 1 and 20")
    .toInt(),
];

export const teamSquadValidator = [
  param("teamId").isInt({ min: 1 }).withMessage("Invalid team ID"),
];

export const playerSearchValidator = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("Player search query is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Player search query must be between 3 and 50 characters"),

  query("season")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Invalid season"),

  query("league").optional().isInt({ min: 1 }).withMessage("Invalid league ID"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Limit must be between 1 and 20")
    .toInt(),
];

export const playerDetailsValidator = [
  param("playerId").isInt({ min: 1 }).withMessage("Invalid player ID"),

  query("season")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Invalid season"),
];

export const teamPlayersValidator = [
  param("teamId").isInt({ min: 1 }).withMessage("Invalid team ID"),

  query("season")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Invalid season"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
];

export const leagueSeasonsValidator = [
  param("leagueId").isInt({ min: 1 }).withMessage("Invalid league ID"),
];
