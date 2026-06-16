import Favorite from "../models/Favorite.js";

// Create Favorite
export const createFavorite = async (userId, favoriteData) => {
  return Favorite.create({
    userId,
    ...favoriteData,
  });
};

// Get Favorite
export const getFavorites = async (userId) => {
  return Favorite.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

// Delete Favorite
export const deleteFavorite = async (favoriteId, userId) => {
  return Favorite.findOneAndDelete({
    _id: favoriteId,
    userId,
  });
};

// sync favorite
export const syncUserFavorites = async ({ userId, favorites }) => {
  if (!favorites || favorites.length === 0) {
    return Favorite.find({ userId }).sort({ createdAt: -1 });
  }

  const operations = favorites.map((favorite) => ({
    updateOne: {
      filter: {
        userId,
        type: favorite.type,
        externalId: favorite.externalId,
      },
      update: {
        $set: {
          userId,
          type: favorite.type,
          externalId: favorite.externalId,
          name: favorite.name,
          logo: favorite.logo || "",
          country: favorite.country || "",
        },
      },
      upsert: true,
    },
  }));

  await Favorite.bulkWrite(operations);

  return Favorite.find({ userId }).sort({ createdAt: -1 });
};
