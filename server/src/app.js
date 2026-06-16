import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import cacheTestRoutes from "./routes/cacheTestRoutes.js";
import footballRoutes from "./routes/footballRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import { notFound, globalErrorHandler } from "./middleware/errorMiddleware.js";

import {
  generalLimiter,
  authLimiter,
  footballLimiter,
} from "./middleware/rateLimiter.js";

import apiUsageRoutes from "./routes/apiUsageRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();

app.use(helmet()); // Adds security headers.
app.use(cors()); // Allows frontend to call backend.
app.use(express.json({ limit: "10kb" })); //Allows JSON request body.
app.use(morgan("dev")); //Logs API requests in terminal.

// Health route:
app.use("/api/health", healthRoutes);

app.use(generalLimiter);
app.use("/api/cache-test", cacheTestRoutes); // Cache route
app.use("/api/football", footballRoutes, footballRoutes); //football routes
app.use("/api/auth", authLimiter, authRoutes); // user routes
app.use("/api/favorites", favoriteRoutes); //Add Favorite
app.use("/api/usage", apiUsageRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
