// Test cache service without API-Football
import { getOrSetCache } from "../services/cacheService.js";

export const testCache = async (req, res) => {
  try {
    const result = await getOrSetCache({
      key: "test-cache",
      type: "TEST",
      ttlSeconds: 30,
      fetchFreshData: async () => {
        return {
          message: "Fresh data generated",
          generatedAt: new Date().toISOString(),
        };
      },
    });

    res.status(200).json({
      success: true,
      source: result.source,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cache test failed",
      error: error.message,
    });
  }
};
