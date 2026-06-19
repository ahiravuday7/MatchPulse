import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { footballService } from "../services/footballService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

const normalizeGroupedPlayers = (players) => {
  if (Array.isArray(players)) {
    return players;
  }

  if (!players || typeof players !== "object") {
    return [];
  }

  return [
    ...(players.goalkeepers || []),
    ...(players.defenders || []),
    ...(players.midfielders || []),
    ...(players.attackers || []),
    ...(players.other || []),
  ];
};

const getSquadPayload = (response) => {
  const data = response?.data || response;

  if (data?.team && data?.players) {
    return {
      team: data.team,
      players: normalizeGroupedPlayers(data.players),
    };
  }

  if (Array.isArray(data) && data[0]) {
    return {
      team: data[0]?.team || null,
      players: normalizeGroupedPlayers(data[0]?.players),
    };
  }

  if (Array.isArray(data?.response) && data.response[0]) {
    return {
      team: data.response[0]?.team || null,
      players: normalizeGroupedPlayers(data.response[0]?.players),
    };
  }

  if (Array.isArray(data?.data) && data.data[0]) {
    return {
      team: data.data[0]?.team || null,
      players: normalizeGroupedPlayers(data.data[0]?.players),
    };
  }

  if (data?.data?.team && data?.data?.players) {
    return {
      team: data.data.team,
      players: normalizeGroupedPlayers(data.data.players),
    };
  }

  return {
    team: null,
    players: [],
  };
};

const groupPlayersByPosition = (players = []) => {
  if (!Array.isArray(players)) {
    return {};
  }

  return players.reduce((groups, player) => {
    const position = player.position || "Unknown";

    if (!groups[position]) {
      groups[position] = [];
    }

    groups[position].push(player);

    return groups;
  }, {});
};

const positionOrder = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Attacker",
  "Unknown",
];

export const TeamSquadPage = () => {
  const { teamId } = useParams();

  const [squadData, setSquadData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSquad = async () => {
    if (!teamId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await footballService.getTeamSquad(teamId);

      console.log("TEAM SQUAD RESPONSE:", result);

      setSquadData(result);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load team squad",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquad();
  }, [teamId]);

  const payload = getSquadPayload(squadData);
  const team = payload.team;
  const players = payload.players;

  const groupedPlayers = useMemo(() => {
    return groupPlayersByPosition(players);
  }, [players]);

  const orderedPositions = positionOrder.filter(
    (position) => groupedPlayers[position]?.length > 0,
  );

  return (
    <section className="page">
      <Link to={`/teams/${teamId}`} className="back-link">
        ← Back to team details
      </Link>

      <div className="page-header">
        <div>
          <h1>{team?.name || "Team Squad"}</h1>
          <p>Current squad and player positions.</p>
        </div>

        <div className="page-actions">
          <Link to={`/teams/${teamId}/players`} className="secondary-button">
            View Season Players
          </Link>
        </div>
      </div>

      {loading && <LoadingState message="Loading squad..." />}

      {!loading && error && <ErrorState message={error} onRetry={fetchSquad} />}

      {!loading && !error && players.length === 0 && (
        <EmptyState
          title="No squad available"
          message="Squad data is not available for this team."
        />
      )}

      {!loading && !error && players.length > 0 && (
        <div className="team-squad-layout">
          {team && (
            <section className="team-profile-card">
              <div className="league-info">
                {team.logo && (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="league-logo"
                  />
                )}

                <div>
                  <h2>{team.name}</h2>
                  <p>{players.length} players found</p>
                </div>
              </div>
            </section>
          )}

          {orderedPositions.map((position) => (
            <section key={position} className="team-profile-card">
              <h2>{position}s</h2>

              <div className="team-squad-grid">
                {groupedPlayers[position].map((player) => (
                  <Link
                    key={player.id}
                    to={`/players/${player.id}`}
                    className="team-squad-card"
                  >
                    <div className="team-squad-photo">
                      {player.photo && (
                        <img src={player.photo} alt={player.name} />
                      )}
                    </div>

                    <div>
                      <h3>{player.name}</h3>

                      <p>
                        {player.position || "Unknown position"}
                        {player.number ? ` • #${player.number}` : ""}
                      </p>

                      <span>
                        {player.age ? `${player.age} years old` : "Age N/A"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
};
