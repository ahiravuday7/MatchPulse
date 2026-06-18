export const createTeamFavorite = (team) => {
  return {
    type: "team",
    externalId: team.id,
    name: team.name,
    logo: team.logo || "",
    country: team.country || "",
  };
};

export const createLeagueFavorite = (league) => {
  return {
    type: "league",
    externalId: league.id,
    name: league.name,
    logo: league.logo || "",
    country: league.country || "",
  };
};

export const createPlayerFavorite = ({ player, summary }) => {
  return {
    type: "player",
    externalId: player.id,
    name: player.name,
    logo: player.photo || "",
    country: player.nationality || "",
    meta: {
      teamId: summary?.team?.id || null,
      teamName: summary?.team?.name || "",
      position: summary?.position || "",
      nationality: player.nationality || "",
    },
  };
};
