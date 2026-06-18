import { body, param } from "express-validator";

export const addFavoriteValidator = [
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Favorite type is required")
    .isIn(["team", "league", "player"])
    .withMessage("Favorite type must be team, league, or player"),

  body("externalId")
    .isInt({ min: 1 })
    .withMessage("External ID must be a valid number")
    .toInt(),

  body("name").trim().notEmpty().withMessage("Favorite name is required"),

  body("logo")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Logo must be a valid URL"),

  body("country")
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage("Country must be a valid string"),

  body("meta").optional().isObject().withMessage("Meta must be an object"),
];

export const favoriteIdValidator = [
  param("favoriteId").isMongoId().withMessage("Invalid favorite ID"),
];
