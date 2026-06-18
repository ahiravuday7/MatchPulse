import Favorite from "../models/Favorite.js";

// Create Favorite
export const createFavorite = async (userId, favoriteData) => {
  const { type, externalId, name, logo, country, meta } = favoriteData;

  const favorite = await Favorite.findOneAndUpdate(
    {
      user: userId,
      type,
      externalId,
    },
    {
      $setOnInsert: {
        user: userId,
        type,
        externalId,
        name,
        logo: logo || "",
        country: country || "",
        meta: meta || {},
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

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
