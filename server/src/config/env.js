import dotenv from "dotenv";

dotenv.config();

const getPositiveInteger = (value, fallback) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
};

const apiDailyLimit = getPositiveInteger(process.env.API_DAILY_LIMIT, 100);

const configuredSoftLimit = getPositiveInteger(process.env.API_SOFT_LIMIT, 90);

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  API_FOOTBALL_KEY: process.env.API_FOOTBALL_KEY,

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  API_DAILY_LIMIT: apiDailyLimit,

  API_SOFT_LIMIT: Math.min(configuredSoftLimit, apiDailyLimit),
};
