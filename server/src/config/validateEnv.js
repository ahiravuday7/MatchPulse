import AppError from "../utils/AppError.js";

const requiredEnvVariables = ["MONGO_URI", "JWT_SECRET", "API_FOOTBALL_KEY"];

export const validateEnv = () => {
  const missingVariables = requiredEnvVariables.filter(
    (variable) => !process.env[variable],
  );

  if (missingVariables.length > 0) {
    throw new AppError(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
      500,
    );
  }

  if (process.env.JWT_SECRET.length < 16) {
    throw new AppError("JWT_SECRET must be at least 16 characters long", 500);
  }
};
