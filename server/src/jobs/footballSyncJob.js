import cron from "node-cron";

import { setCache } from "../services/cacheService.js";

import {
  getLiveFixturesFromApi,
  getFixturesByDateFromApi,
  getLeagueStandingsFromApi,
} from "../services/apiFootballService.js";

import { cacheKeys } from "../utils/cacheKeys.js";
import { CACHE_DURATIONS } from "../utils/cacheDurations.js";
import { getTodayDate } from "../utils/dateUtils.js";

const POPULAR_LEAGUES = [
  {
    id: 39,
    name: "Premier League",
    season: 2024,
  },
  {
    id: 140,
    name: "La Liga",
    season: 2024,
  },
  {
    id: 78,
    name: "Bundesliga",
    season: 2024,
  },
  {
    id: 135,
    name: "Serie A",
    season: 2024,
  },
  {
    id: 61,
    name: "Ligue 1",
    season: 2024,
  },
];

const syncLiveMatches = async () => {
  try {
    console.log("[CRON] Syncing live matches...");

    const data = await getLiveFixturesFromApi();

    await setCache({
      key: cacheKeys.liveMatches(),
      type: "LIVE_MATCHES",
      data,
      ttlSeconds: CACHE_DURATIONS.LIVE_MATCHES,
    });

    console.log("[CRON] Live matches synced");
  } catch (error) {
    console.error("[CRON] Live matches sync failed:", error.message);
  }
};

const syncTodayFixtures = async () => {
  try {
    console.log("[CRON] Syncing today fixtures...");

    const today = getTodayDate();

    const data = await getFixturesByDateFromApi(today);

    await setCache({
      key: cacheKeys.todayFixtures(today),
      type: "TODAY_FIXTURES",
      data,
      ttlSeconds: CACHE_DURATIONS.TODAY_FIXTURES,
    });

    console.log("[CRON] Today fixtures synced");
  } catch (error) {
    console.error("[CRON] Today fixtures sync failed:", error.message);
  }
};

const syncPopularStandings = async () => {
  try {
    console.log("[CRON] Syncing popular league standings...");

    for (const league of POPULAR_LEAGUES) {
      const data = await getLeagueStandingsFromApi(league.id, league.season);

      await setCache({
        key: cacheKeys.leagueStandings(league.id, league.season),
        type: "LEAGUE_STANDINGS",
        data,
        ttlSeconds: CACHE_DURATIONS.LEAGUE_STANDINGS,
      });

      console.log(`[CRON] Synced standings: ${league.name}`);
    }
  } catch (error) {
    console.error("[CRON] Standings sync failed:", error.message);
  }
};

export const startFootballSyncJobs = () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  cron.schedule("*/30 * * * *", syncLiveMatches);

  cron.schedule("0 */6 * * *", syncTodayFixtures);

  cron.schedule("0 3 * * *", syncPopularStandings);

  console.log("[CRON] Football sync jobs scheduled");
};

// Why we need
// Until Phase 10, MatchPulse works like this:
// User opens page → backend checks cache → if cache expired → backend calls API-Football.
// Problem:
// API-Football free plan has limited requests. If many users open the app, your backend may call API-Football too many times.
// So Phase 11 improves the architecture:
// Cron job refreshes cache automatically → user usually gets data from MongoDB cache → fewer API calls → faster response.

// What is Node-Cron?
// Node-Cron is a scheduler for Node.js. It runs a function automatically at a fixed time.
// Example: cron.schedule("*/30 * * * *", syncLiveMatches); (Run syncLiveMatches() every 30 minutes.)

// What is Background Sync Job?
// A background sync job means: A task runs automatically in the backend without user action.
// Example: syncLiveMatches()

// What is API Request Budget Strategy?
// It means planning how many API calls your app will make per day.
// Free limit: Around 100 requests/day
