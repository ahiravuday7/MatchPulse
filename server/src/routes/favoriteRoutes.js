import express from "express";

import {
  addFavoriteController,
  getFavoritesController,
  deleteFavoriteController,
  syncFavoritesController,
} from "../controllers/favoriteController.js";

import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

import {
  addFavoriteValidator,
  favoriteIdValidator,
  syncFavoritesValidator,
} from "../validators/favoriteValidators.js";

const router = express.Router();

router.use(protect);

router.post("/", addFavoriteValidator, validateRequest, addFavoriteController);
router.post(
  "/sync",
  syncFavoritesValidator,
  validateRequest,
  syncFavoritesController,
);
router.get("/", getFavoritesController);

router.delete(
  "/:favoriteId",
  favoriteIdValidator,
  validateRequest,
  deleteFavoriteController,
);

export default router;
