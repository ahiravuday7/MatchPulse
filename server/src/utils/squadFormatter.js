const normalizePosition = (position) => {
  const normalizedPosition = position?.trim().toLowerCase();

  switch (normalizedPosition) {
    case "goalkeeper":
      return "goalkeepers";

    case "defender":
      return "defenders";

    case "midfielder":
      return "midfielders";

    case "attacker":
      return "attackers";

    default:
      return "other";
  }
};

const formatPlayer = (player) => ({
  id: player.id,
  name: player.name,
  age: player.age,
  number: player.number,
  position: player.position,
  photo: player.photo,
});

export const formatTeamSquad = (squadResponse) => {
  const squadData = squadResponse?.response?.[0];

  if (!squadData) {
    return null;
  }

  const players = squadData.players?.map(formatPlayer) || [];

  const groupedPlayers = {
    goalkeepers: [],
    defenders: [],
    midfielders: [],
    attackers: [],
    other: [],
  };

  players.forEach((player) => {
    const group = normalizePosition(player.position);

    groupedPlayers[group].push(player);
  });

  return {
    team: {
      id: squadData.team.id,
      name: squadData.team.name,
      logo: squadData.team.logo,
    },

    counts: {
      total: players.length,
      goalkeepers: groupedPlayers.goalkeepers.length,
      defenders: groupedPlayers.defenders.length,
      midfielders: groupedPlayers.midfielders.length,
      attackers: groupedPlayers.attackers.length,
      other: groupedPlayers.other.length,
    },

    players: groupedPlayers,
  };
};
