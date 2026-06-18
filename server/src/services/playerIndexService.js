import PlayerIndex from "../models/PlayerIndex.js";
import { getTeamSquadFromApi } from "./apiFootballService.js";
import { POPULAR_PLAYER_INDEX_TEAMS } from "../utils/popularTeams.js";

const normalizeText = (value = "") => {
  return String(value).trim().toLowerCase();
};

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const formatIndexedPlayer = (player) => {
  return {
    player: {
      id: player.externalId,
      name: player.name,
      age: player.age,
      number: player.number,
      position: player.position,
      photo: player.photo,
    },

    currentContext: {
      team: player.currentTeam
        ? {
            id: player.currentTeam.id,
            name: player.currentTeam.name,
            logo: player.currentTeam.logo,
          }
        : null,

      position: player.position || null,
      league: null,
    },
  };
};

const calculateSearchScore = (player, searchTerm) => {
  const name = normalizeText(player.name);
  const teamName = normalizeText(player.currentTeam?.name);

  if (name === searchTerm) return 100;
  if (name.startsWith(searchTerm)) return 90;

  const words = name.split(" ");

  if (words.some((word) => word.startsWith(searchTerm))) return 80;
  if (name.includes(searchTerm)) return 70;
  if (teamName.includes(searchTerm)) return 30;

  return 0;
};

export const syncPlayerIndex = async ({ teamIds = null } = {}) => {
  const selectedTeams = teamIds?.length
    ? POPULAR_PLAYER_INDEX_TEAMS.filter((team) => teamIds.includes(team.id))
    : POPULAR_PLAYER_INDEX_TEAMS;

  const summary = {
    teamsRequested: selectedTeams.length,
    teamsSynced: 0,
    teamsFailed: 0,
    playersUpserted: 0,
    failedTeams: [],
  };

  for (const team of selectedTeams) {
    try {
      const squadResponse = await getTeamSquadFromApi(team.id);
      const squadData = squadResponse?.response?.[0];

      if (!squadData?.players?.length) {
        summary.teamsFailed += 1;
        summary.failedTeams.push({
          team,
          reason: "No squad data returned",
        });
        continue;
      }

      const teamInfo = {
        id: squadData.team.id,
        name: squadData.team.name,
        logo: squadData.team.logo,
      };

      const operations = squadData.players.map((player) => ({
        updateOne: {
          filter: {
            externalId: player.id,
          },
          update: {
            $set: {
              externalId: player.id,
              name: player.name,
              searchName: normalizeText(player.name),
              age: player.age || null,
              number: player.number || null,
              position: player.position || "",
              photo: player.photo || "",
              currentTeam: teamInfo,
              lastSyncedAt: new Date(),
            },
            $addToSet: {
              sourceTeams: teamInfo,
            },
          },
          upsert: true,
        },
      }));

      await PlayerIndex.bulkWrite(operations);

      summary.teamsSynced += 1;
      summary.playersUpserted += operations.length;
    } catch (error) {
      summary.teamsFailed += 1;
      summary.failedTeams.push({
        team,
        reason: error.message,
      });
    }
  }

  const totalIndexedPlayers = await PlayerIndex.countDocuments();

  return {
    ...summary,
    totalIndexedPlayers,
  };
};

export const searchPlayerIndex = async ({ query, limit = 20 }) => {
  const searchTerm = normalizeText(query);
  const safeSearchTerm = escapeRegex(searchTerm);

  const regex = new RegExp(safeSearchTerm, "i");

  const players = await PlayerIndex.find({
    $or: [
      {
        searchName: regex,
      },
      {
        name: regex,
      },
      {
        "currentTeam.name": regex,
      },
    ],
  })
    .limit(80)
    .lean();

  const sortedPlayers = players
    .map((player) => ({
      ...player,
      score: calculateSearchScore(player, searchTerm),
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(formatIndexedPlayer);

  return {
    source: "local-index",
    query,
    count: sortedPlayers.length,
    data: sortedPlayers,
  };
};

export const getPlayerIndexStatus = async () => {
  const totalIndexedPlayers = await PlayerIndex.countDocuments();

  const latestSync = await PlayerIndex.findOne()
    .sort({ lastSyncedAt: -1 })
    .select("lastSyncedAt")
    .lean();

  return {
    totalIndexedPlayers,
    lastSyncedAt: latestSync?.lastSyncedAt || null,
  };
};
