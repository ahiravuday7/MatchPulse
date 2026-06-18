import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { footballService } from "../services/footballService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { SourceBadge } from "../components/common/SourceBadge";

import { FavoriteButton } from "../components/common/FavoriteButton";
import { createPlayerFavorite } from "../utils/favoritePayloads";

const DEFAULT_SEASON_OPTIONS = [
  { value: 2025, label: "2025/2026" },
  { value: 2024, label: "2024/2025" },
  { value: 2023, label: "2023/2024" },
  { value: 2022, label: "2022/2023" },
  { value: 2021, label: "2021/2022" },
];

const LEAGUE_OPTIONS = [
  { value: "", label: "All competitions" },
  { value: 39, label: "Premier League" },
  { value: 140, label: "La Liga" },
  { value: 78, label: "Bundesliga" },
  { value: 135, label: "Serie A" },
  { value: 61, label: "Ligue 1" },
  { value: 2, label: "Champions League" },
  { value: 253, label: "MLS" },
  { value: 307, label: "Saudi Pro League" },
];

const getDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
};

const StatTile = ({ label, value }) => {
  return (
    <div className="player-stat-tile">
      <span>{label}</span>
      <strong>{getDisplayValue(value)}</strong>
    </div>
  );
};

const StatsGroup = ({ title, children }) => {
  return (
    <section className="player-stats-group">
      <h3>{title}</h3>
      <div className="player-stat-grid">{children}</div>
    </section>
  );
};

export const PlayerDetailsPage = () => {
  const { playerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSeason = Number(searchParams.get("season")) || 2024;
  const initialLeagueId = searchParams.get("league") || "";

  const [season, setSeason] = useState(initialSeason);
  const [leagueId, setLeagueId] = useState(initialLeagueId);
  const [seasonOptions, setSeasonOptions] = useState(DEFAULT_SEASON_OPTIONS);

  const [playerDetails, setPlayerDetails] = useState(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [error, setError] = useState("");

  const player = playerDetails?.player;
  const summary = playerDetails?.summary;
  const statistics = playerDetails?.statistics || [];

  const playerFavorite =
    player && summary
      ? createPlayerFavorite({
          player,
          summary,
        })
      : null;

  const selectedLeagueName = useMemo(() => {
    return (
      LEAGUE_OPTIONS.find((league) => String(league.value) === String(leagueId))
        ?.label || "All competitions"
    );
  }, [leagueId]);

  const updateUrlParams = ({ nextSeason, nextLeagueId }) => {
    const params = new URLSearchParams();

    params.set("season", String(nextSeason));

    if (nextLeagueId) {
      params.set("league", String(nextLeagueId));
    }

    setSearchParams(params, {
      replace: true,
    });
  };

  const fetchSeasons = async () => {
    try {
      setSeasonLoading(true);

      const result = await footballService.getAvailableSeasons();

      if (result.data?.length) {
        setSeasonOptions(result.data);
      }
    } catch {
      setSeasonOptions(DEFAULT_SEASON_OPTIONS);
    } finally {
      setSeasonLoading(false);
    }
  };

  const fetchPlayerDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await footballService.getPlayerDetails({
        playerId,
        season,
        leagueId,
      });

      setPlayerDetails(result.data);
      setSource(result.source);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load player details",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    updateUrlParams({
      nextSeason: season,
      nextLeagueId: leagueId,
    });

    fetchPlayerDetails();
  }, [playerId, season, leagueId]);

  const handleSeasonChange = (event) => {
    setSeason(Number(event.target.value));
  };

  const handleLeagueChange = (event) => {
    setLeagueId(event.target.value);
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Player Details</h1>
          <p>
            Season statistics and competition-wise performance for player ID{" "}
            {playerId}.
          </p>
        </div>

        <div className="page-actions">
          {source && <SourceBadge source={source} />}
        </div>
      </div>

      <div className="player-filter-panel">
        <select
          className="season-select"
          value={season}
          disabled={seasonLoading}
          onChange={handleSeasonChange}
        >
          {seasonOptions.map((seasonOption) => (
            <option key={seasonOption.value} value={seasonOption.value}>
              {seasonOption.label}
            </option>
          ))}
        </select>

        <select
          className="season-select"
          value={leagueId}
          onChange={handleLeagueChange}
        >
          {LEAGUE_OPTIONS.map((league) => (
            <option key={league.label} value={league.value}>
              {league.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingState message="Loading player details..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchPlayerDetails} />
      )}

      {!loading && !error && !playerDetails && (
        <EmptyState
          title="No player data found"
          message="Try selecting a different season or competition."
        />
      )}

      {!loading && !error && playerDetails && (
        <div className="player-details-layout">
          <section className="player-profile-card">
            <div className="player-profile-main">
              {player?.photo && (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="player-profile-photo"
                />
              )}

              <div>
                <h2>{player?.name}</h2>

                <p>
                  {summary?.team?.name || "Unknown team"}
                  {summary?.position ? ` • ${summary.position}` : ""}
                </p>

                <span>
                  {player?.nationality || "Unknown nationality"} •{" "}
                  {selectedLeagueName}
                </span>
                {playerFavorite && <FavoriteButton favorite={playerFavorite} />}
              </div>
            </div>

            <div className="player-profile-meta">
              <StatTile label="Age" value={player?.age} />
              <StatTile label="Height" value={player?.height} />
              <StatTile label="Weight" value={player?.weight} />
              <StatTile
                label="Injured"
                value={player?.injured ? "Yes" : "No"}
              />
            </div>
          </section>

          <section className="player-summary-card">
            <h2>Season Summary</h2>

            <div className="player-stat-grid">
              <StatTile label="Appearances" value={summary?.appearances} />
              <StatTile label="Starts" value={summary?.starts} />
              <StatTile label="Minutes" value={summary?.minutes} />
              <StatTile label="Goals" value={summary?.goals} />
              <StatTile label="Assists" value={summary?.assists} />
              <StatTile label="Rating" value={summary?.rating} />
              <StatTile label="Yellow Cards" value={summary?.yellowCards} />
              <StatTile label="Red Cards" value={summary?.redCards} />
            </div>
          </section>

          {statistics.length === 0 && (
            <EmptyState
              title="No statistics available"
              message="This player has no statistics for the selected season or competition."
            />
          )}

          {statistics.map((statistic) => (
            <section
              key={`${statistic.league?.id}-${statistic.team?.id}`}
              className="player-competition-card"
            >
              <div className="player-competition-header">
                <div>
                  <h2>{statistic.league?.name || "Competition"}</h2>
                  <p>{statistic.team?.name || "Unknown team"}</p>
                </div>

                <div className="player-competition-logos">
                  {statistic.team?.logo && (
                    <img src={statistic.team.logo} alt={statistic.team.name} />
                  )}

                  {statistic.league?.logo && (
                    <img
                      src={statistic.league.logo}
                      alt={statistic.league.name}
                    />
                  )}
                </div>
              </div>

              <StatsGroup title="Games">
                <StatTile
                  label="Appearances"
                  value={statistic.games?.appearences}
                />
                <StatTile label="Starts" value={statistic.games?.lineups} />
                <StatTile label="Minutes" value={statistic.games?.minutes} />
                <StatTile label="Position" value={statistic.games?.position} />
                <StatTile label="Rating" value={statistic.games?.rating} />
              </StatsGroup>

              <StatsGroup title="Attack">
                <StatTile label="Goals" value={statistic.goals?.total} />
                <StatTile label="Assists" value={statistic.goals?.assists} />
                <StatTile label="Shots" value={statistic.shots?.total} />
                <StatTile label="Shots on Target" value={statistic.shots?.on} />
              </StatsGroup>

              <StatsGroup title="Passing">
                <StatTile
                  label="Total Passes"
                  value={statistic.passes?.total}
                />
                <StatTile label="Key Passes" value={statistic.passes?.key} />
                <StatTile
                  label="Pass Accuracy"
                  value={statistic.passes?.accuracy}
                />
              </StatsGroup>

              <StatsGroup title="Defense">
                <StatTile label="Tackles" value={statistic.tackles?.total} />
                <StatTile label="Blocks" value={statistic.tackles?.blocks} />
                <StatTile
                  label="Interceptions"
                  value={statistic.tackles?.interceptions}
                />
              </StatsGroup>

              <StatsGroup title="Duels & Dribbles">
                <StatTile label="Duels" value={statistic.duels?.total} />
                <StatTile label="Duels Won" value={statistic.duels?.won} />
                <StatTile
                  label="Dribbles Attempted"
                  value={statistic.dribbles?.attempts}
                />
                <StatTile
                  label="Dribbles Success"
                  value={statistic.dribbles?.success}
                />
              </StatsGroup>

              <StatsGroup title="Cards & Fouls">
                <StatTile
                  label="Yellow Cards"
                  value={statistic.cards?.yellow}
                />
                <StatTile label="Red Cards" value={statistic.cards?.red} />
                <StatTile label="Fouls Drawn" value={statistic.fouls?.drawn} />
                <StatTile
                  label="Fouls Committed"
                  value={statistic.fouls?.committed}
                />
              </StatsGroup>

              <StatsGroup title="Penalties">
                <StatTile label="Scored" value={statistic.penalty?.scored} />
                <StatTile label="Missed" value={statistic.penalty?.missed} />
                <StatTile label="Won" value={statistic.penalty?.won} />
                <StatTile
                  label="Committed"
                  value={statistic.penalty?.commited}
                />
              </StatsGroup>
            </section>
          ))}
        </div>
      )}
    </section>
  );
};
