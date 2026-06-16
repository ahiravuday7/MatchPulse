import mongoose from "mongoose";

import { asyncHandler } from "../middleware/asyncHandler.js";
import { env } from "../config/env.js";

export const healthController = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "MatchPulse API is running",
    environment: env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export const livenessController = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    status: "alive",
    timestamp: new Date().toISOString(),
  });
});

export const readinessController = asyncHandler(async (req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;

  res.status(mongoReady ? 200 : 503).json({
    success: mongoReady,
    status: mongoReady ? "ready" : "not_ready",
    checks: {
      database: mongoReady ? "connected" : "disconnected",
      apiFootballKey: Boolean(env.API_FOOTBALL_KEY),
      jwtSecret: Boolean(env.JWT_SECRET),
    },
    timestamp: new Date().toISOString(),
  });
});
