import {
  createFavorite,
  getFavorites,
  deleteFavorite,
  syncUserFavorites,
} from "../services/favoriteService.js";

import { asyncHandler } from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const addFavoriteController = asyncHandler(async (req, res) => {
  try {
    const favorite = await createFavorite(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Already added to favorites", 409);
    }

    throw error;
  }
});

export const getFavoritesController = asyncHandler(async (req, res) => {
  const favorites = await getFavorites(req.user.id);

  res.status(200).json({
    success: true,
    count: favorites.length,
    data: favorites,
  });
});

export const deleteFavoriteController = asyncHandler(async (req, res) => {
  const deleted = await deleteFavorite(req.params.favoriteId, req.user.id);

  if (!deleted) {
    throw new AppError("Favorite not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Favorite removed",
  });
});

export const syncFavoritesController = asyncHandler(async (req, res) => {
  const favorites = await syncUserFavorites({
    userId: req.user._id,
    favorites: req.body.favorites,
  });

  res.status(200).json({
    success: true,
    message: "Favorites synced successfully",
    count: favorites.length,
    data: favorites,
  });
});
