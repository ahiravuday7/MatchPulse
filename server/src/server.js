import mongoose from "mongoose";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { validateEnv } from "./config/validateEnv.js";
import { startFootballSyncJobs } from "./jobs/footballSyncJob.js";

let server;

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("HTTP server closed");

      await mongoose.connection.close(false);
      console.log("MongoDB connection closed");

      process.exit(0);
    });
  } else {
    process.exit(0);
  }

  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

const startServer = async () => {
  try {
    validateEnv();

    console.log("API key loaded:", Boolean(env.API_FOOTBALL_KEY));

    await connectDB();

    server = app.listen(env.PORT, () => {
      console.log(`MatchPulse server running on port ${env.PORT}`);

      startFootballSyncJobs();
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error.message);
  shutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
  process.exit(1);
});

startServer();
