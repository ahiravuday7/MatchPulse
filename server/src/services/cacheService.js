import Cache from "../models/Cache.js";

// Check if valid cache exists
export const getCache = async (key) => {
  const cachedItem = await Cache.findOne({ key }); //Find cache document from MongoDB.

  //No cache found.
  if (!cachedItem) {
    return null;
  }

  const now = new Date();

  //Cache exists but expired.
  if (cachedItem.expiresAt <= now) {
    return null;
  }

  return cachedItem.data; //Cache is valid, return cached data.
};

// Save or update cache
// Create new cache - Update existing cache
export const setCache = async ({ key, type, data, ttlSeconds }) => {
  const now = new Date();

  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

  const cacheItem = await Cache.findOneAndUpdate(
    { key },
    {
      key,
      type,
      data,
      expiresAt,
      lastFetchedAt: now,
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    },
  );

  return cacheItem;
};

// Main reusable cache function
// 1. Check cache,2. If cache exists, return source = cache,3. If cache missing/expired, fetch fresh data,4. Save fresh data,5. Return source = api
export const getOrSetCache = async ({
  key,
  type,
  ttlSeconds,
  fetchFreshData,
}) => {
  const cachedData = await getCache(key);

  if (cachedData) {
    return {
      source: "cache",
      data: cachedData,
    };
  }

  const freshData = await fetchFreshData();

  await setCache({
    key,
    type,
    data: freshData,
    ttlSeconds,
  });

  return {
    source: "api",
    data: freshData,
  };
};

// Cache Service
// It has 3 main functions:
// getCache() - Check if valid cache exists,setCache() - Save or update cache,getOrSetCache() - Main reusable cache function
