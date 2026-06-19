import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { footballService } from "../services/footballService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

const DEFAULT_SEASON = 2024;

const getPlayersPayload = (response) => {
  const data = response?.data || response;

  // Your backend shape:
  // { success, source, season, data: { count, players } }
  if (Array.isArray(data?.players)) {
    return {
      team: data.players[0]?.statistics?.team || null,
      players: data.players,
    };
  }

  if (Array.isArray(data?.data?.players)) {
    return {
      team: data.data.players[0]?.statistics?.team || null,
      players: data.data.players,
    };
  }

  if (Array.isArray(data)) {
    return {
      team: data[0]?.statistics?.team || null,
      players: data,
    };
  }

  return {
    team: null,
    players: [],
  };
};

const getPlayerInfo = (item) => {
  return item.player || item;
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
};

const formatRating = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return Number(value).toFixed(1);
};

const getPlayerStats = (item) => {
  const statistics = item.statistics || {};

  return {
    appearances: formatValue(statistics.games?.appearences),
    minutes: formatValue(statistics.games?.minutes),
    goals: formatValue(statistics.goals?.total),
    assists: formatValue(statistics.goals?.assists),
    rating: formatRating(item.rating || statistics.games?.rating),
    position: item.position || statistics.games?.position || "-",
  };
};

export const TeamPlayersPage = () => {
  const { teamId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const seasonFromUrl = Number(searchParams.get("season")) || DEFAULT_SEASON;

  const [season, setSeason] = useState(seasonFromUrl);
  const [playersData, setPlayersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTeamPlayers = async () => {
    if (!teamId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await footballService.getTeamPlayers({
        teamId,
        season,
      });

      setPlayersData(result);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load team players",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonChange = (event) => {
    const selectedSeason = Number(event.target.value);

    setSeason(selectedSeason);
    setSearchParams({
      season: String(selectedSeason),
    });
  };

  useEffect(() => {
    fetchTeamPlayers();
  }, [teamId, season]);

  const payload = getPlayersPayload(playersData);
  const team = payload.team;
  const players = payload.players;

  return (
    <section className="page">
      <Link to={`/teams/${teamId}`} className="back-link">
        ← Back to team details
      </Link>

      <div className="page-header">
        <div>
          <h1>{team?.name || "Team Players"}</h1>
          <p>Season-wise player statistics.</p>
        </div>

        <div className="page-actions">
          <select
            className="season-select"
            value={season}
            onChange={handleSeasonChange}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>

          <Link to={`/teams/${teamId}/squad`} className="secondary-button">
            View Squad
          </Link>
        </div>
      </div>

      {loading && <LoadingState message="Loading team players..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchTeamPlayers} />
      )}

      {!loading && !error && players.length === 0 && (
        <EmptyState
          title="No players available"
          message="Player statistics are not available for this team and season."
        />
      )}

      {!loading && !error && players.length > 0 && (
        <section className="standings-table-card">
          <div className="standings-table-wrapper">
            <table className="standings-table team-players-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Position</th>
                  <th>Apps</th>
                  <th>Minutes</th>
                  <th>Goals</th>
                  <th>Assists</th>
                  <th>Rating</th>
                </tr>
              </thead>

              <tbody>
                {players.map((item) => {
                  const player = getPlayerInfo(item);
                  const stats = getPlayerStats(item);

                  return (
                    <tr key={player.id || player.playerId}>
                      <td>
                        <Link
                          to={`/players/${player.id || player.playerId}?season=${season}`}
                          className="standings-team"
                        >
                          {player.photo && (
                            <img src={player.photo} alt={player.name} />
                          )}

                          <span>{player.name || "Unknown player"}</span>
                        </Link>
                      </td>

                      <td>{stats.position}</td>
                      <td>{stats.appearances}</td>
                      <td>{stats.minutes}</td>
                      <td>{stats.goals}</td>
                      <td>{stats.assists}</td>
                      <td>
                        <strong>{stats.rating || "-"}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
};
