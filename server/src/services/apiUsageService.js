import ApiUsage from "../models/ApiUsage.js";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";

const getUtcDateKey = () => {
  return new Date().toISOString().slice(0, 10);
};

const normalizeMetricKey = (value) => {
  return String(value || "unknown")
    .trim()
    .toLowerCase()
    .replace(/^\/+/, "")
    .replace(/[^a-z0-9_-]/g, "_");
};

/**
 * Atomically reserves one request from today's safety budget.
 *
 * This happens before the external API request, preventing most
 * concurrency scenarios from exceeding the configured safety limit.
 */
export const reserveApiRequest = async (endpoint) => {
  const dateKey = getUtcDateKey();
  const endpointKey = normalizeMetricKey(endpoint);
  const now = new Date();

  const existingUsage = await ApiUsage.findOneAndUpdate(
    {
      dateKey,
      totalRequests: {
        $lt: env.API_SOFT_LIMIT,
      },
    },
    {
      $inc: {
        totalRequests: 1,
        [`endpoints.${endpointKey}`]: 1,
      },
      $set: {
        lastRequestAt: now,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (existingUsage) {
    return {
      dateKey,
      endpointKey,
    };
  }

  const usageForToday = await ApiUsage.findOne({
    dateKey,
  })
    .select("totalRequests")
    .lean();

  if (usageForToday) {
    throw new AppError(
      `API-Football safety limit reached: ${usageForToday.totalRequests}/${env.API_DAILY_LIMIT} requests used`,
      503,
    );
  }

  try {
    await ApiUsage.create({
      dateKey,
      totalRequests: 1,
      successfulRequests: 0,
      failedRequests: 0,
      endpoints: {
        [endpointKey]: 1,
      },
      statusCodes: {},
      lastRequestAt: now,
    });

    return {
      dateKey,
      endpointKey,
    };
  } catch (error) {
    /*
     * Another request may have created today's record
     * between our find and create operations.
     */
    if (error.code === 11000) {
      return reserveApiRequest(endpoint);
    }

    throw error;
  }
};

/**
 * Marks a previously reserved request as successful or failed.
 */
export const markApiRequestResult = async ({
  dateKey,
  success,
  statusCode,
}) => {
  const statusKey = statusCode ? String(statusCode) : "network_error";

  const increments = {
    [success ? "successfulRequests" : "failedRequests"]: 1,

    [`statusCodes.${statusKey}`]: 1,
  };

  await ApiUsage.updateOne(
    {
      dateKey,
    },
    {
      $inc: increments,
      $set: {
        lastRequestAt: new Date(),
      },
    },
  );
};

export const getTodayApiUsage = async () => {
  const dateKey = getUtcDateKey();

  const usage = await ApiUsage.findOne({
    dateKey,
  });

  const totalRequests = usage?.totalRequests || 0;

  const endpoints = usage?.endpoints
    ? Object.fromEntries(usage.endpoints.entries())
    : {};

  const statusCodes = usage?.statusCodes
    ? Object.fromEntries(usage.statusCodes.entries())
    : {};

  const percentageUsed =
    env.API_DAILY_LIMIT > 0
      ? Number(((totalRequests / env.API_DAILY_LIMIT) * 100).toFixed(2))
      : 0;

  return {
    date: dateKey,

    budget: {
      dailyLimit: env.API_DAILY_LIMIT,
      safetyLimit: env.API_SOFT_LIMIT,

      used: totalRequests,

      remainingBeforeSafetyStop: Math.max(
        env.API_SOFT_LIMIT - totalRequests,
        0,
      ),

      estimatedProviderRemaining: Math.max(
        env.API_DAILY_LIMIT - totalRequests,
        0,
      ),

      percentageUsed,
    },

    requests: {
      total: totalRequests,
      successful: usage?.successfulRequests || 0,
      failed: usage?.failedRequests || 0,
    },

    endpoints,
    statusCodes,

    lastRequestAt: usage?.lastRequestAt || null,
  };
};
