import { asyncHandler } from "../middleware/asyncHandler.js";

import { getTodayApiUsage } from "../services/apiUsageService.js";

export const getTodayApiUsageController = asyncHandler(async (req, res) => {
  const usage = await getTodayApiUsage();

  res.status(200).json({
    success: true,
    data: usage,
  });
});
