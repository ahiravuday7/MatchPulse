import { asyncHandler } from "../middleware/asyncHandler.js";

import {
  syncPlayerIndex,
  getPlayerIndexStatus,
} from "../services/playerIndexService.js";

export const syncPlayerIndexController = asyncHandler(async (req, res) => {
  const result = await syncPlayerIndex({
    teamIds: req.body.teamIds,
  });

  res.status(200).json({
    success: true,
    message: "Player index synced successfully",
    data: result,
  });
});

export const getPlayerIndexStatusController = asyncHandler(async (req, res) => {
  const result = await getPlayerIndexStatus();

  res.status(200).json({
    success: true,
    data: result,
  });
});
