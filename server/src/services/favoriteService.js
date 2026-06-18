import Favorite from "../models/Favorite.js";

// Create Favorite
export const createFavorite = async (userId, favoriteData) => {
  const { type, externalId, name, logo, country, meta } = favoriteData;

  const favorite = await Favorite.create({
    user: userId,
    type,
    externalId,
    name,
    logo: logo || "",
    country: country || "",
    meta: meta || {},
  });

  return favorite;
};

// Get Favorite
export const getFavorites = async (userId) => {
  return Favorite.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

// Delete Favorite
export const deleteFavorite = async (favoriteId, userId) => {
  return Favorite.findOneAndDelete({
    _id: favoriteId,
    user: userId,
  });
};

// sync favorite
export const syncUserFavorites = async ({ userId, favorites = [] }) => {
  const operations = favorites.map((favorite) => ({
    updateOne: {
      filter: {
        user: userId,
        type: favorite.type,
        externalId: favorite.externalId,
      },
      update: {
        $set: {
          user: userId,
          type: favorite.type,
          externalId: favorite.externalId,
          name: favorite.name,
          logo: favorite.logo || "",
          country: favorite.country || "",
          meta: favorite.meta || {},
        },
      },
      upsert: true,
    },
  }));
  if (operations.length > 0) {
    await Favorite.bulkWrite(operations);
  }

  return Favorite.find({
    user: userId,
  }).sort({ createdAt: -1 });
};
