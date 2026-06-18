import { body, param } from "express-validator";

export const addFavoriteValidator = [
  body("type")
    .isIn(["team", "league", "player"])
    .withMessage("Favorite type must be team, league, or player"),

  body("externalId")
    .isInt({ min: 1 })
    .withMessage("External ID must be a valid number"),

  body("name").trim().notEmpty().withMessage("Favorite name is required"),

  body("logo")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Logo must be a valid URL"),

  body("country").optional().trim(),
];

export const favoriteIdValidator = [
  param("favoriteId").isMongoId().withMessage("Invalid favorite ID"),
];

export const syncFavoritesValidator = [
  body("favorites")
    .isArray({ max: 100 })
    .withMessage("Favorites must be an array with maximum 100 items"),

  body("favorites.*.type")
    .isIn(["team", "league"])
    .withMessage("Favorite type must be team or league"),

  body("favorites.*.externalId")
    .isInt({ min: 1 })
    .withMessage("External ID must be a valid number"),

  body("favorites.*.name")
    .trim()
    .notEmpty()
    .withMessage("Favorite name is required"),

  body("favorites.*.logo")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Logo must be a valid URL"),

  body("favorites.*.country").optional({ checkFalsy: true }).trim(),
];
