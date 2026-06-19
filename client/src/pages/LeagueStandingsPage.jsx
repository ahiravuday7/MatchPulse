import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { footballService } from "../services/footballService";

import { FavoriteButton } from "../components/common/FavoriteButton";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

const DEFAULT_SEASON = 2024;

export const LeagueStandingsPage = () => {
  const { leagueId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const seasonFromUrl = Number(searchParams.get("season")) || DEFAULT_SEASON;

  const [standingsData, setStandingsData] = useState(null);
  const [season, setSeason] = useState(seasonFromUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStandings = async () => {
    if (!leagueId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await footballService.getLeagueStandings({
        leagueId,
        season,
      });

      setStandingsData(result);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load league standings",
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
    fetchStandings();
  }, [leagueId, season]);

  const data = standingsData?.data || standingsData;
  const league = data?.league;
  const standings = data?.standings || [];

  const leagueFavorite = league?.id
    ? {
        type: "league",
        externalId: Number(league.id),
        name: league.name,
        logo: league.logo || "",
        country: league.country || "",
        meta: {
          season: league.season || season,
          flag: league.flag || "",
        },
      }
    : null;

  return (
    <section className="page">
      <Link to="/search" className="back-link">
        ← Back to search
      </Link>

      <div className="page-header">
        <div>
          <h1>{league?.name || "League Standings"}</h1>

          <p>
            {league?.country || "League table"}
            {season ? ` • ${season}` : ""}
          </p>
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

          {leagueFavorite && <FavoriteButton favorite={leagueFavorite} />}
        </div>
      </div>

      {loading && <LoadingState message="Loading standings..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchStandings} />
      )}

      {!loading && !error && !league && (
        <EmptyState
          title="League not found"
          message="We could not find standings for this league."
        />
      )}

      {!loading && !error && league && (
        <div className="standings-layout">
          <section className="standings-header-card">
            <div className="league-info">
              {league.logo && (
                <img
                  src={league.logo}
                  alt={league.name}
                  className="league-logo"
                />
              )}

              <div>
                <h2>{league.name}</h2>

                <p>
                  {league.country || "Unknown country"}
                  {league.season ? ` • ${league.season}` : ""}
                </p>
              </div>
            </div>

            {league.flag && (
              <img
                src={league.flag}
                alt={league.country}
                className="league-logo"
              />
            )}
          </section>

          {standings.length === 0 && (
            <EmptyState
              title="No standings available"
              message="Standings are not available for this league and season."
            />
          )}

          {standings.length > 0 && (
            <section className="standings-table-card">
              <div className="standings-table-wrapper">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Team</th>
                      <th>MP</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GF</th>
                      <th>GA</th>
                      <th>GD</th>
                      <th>Pts</th>
                    </tr>
                  </thead>

                  <tbody>
                    {standings.map((row) => {
                      const team = row.team;
                      const all = row.all;

                      return (
                        <tr key={team?.id || row.rank}>
                          <td>{row.rank}</td>

                          <td>
                            <Link
                              to={`/teams/${team?.id}?season=${season}`}
                              className="standings-team"
                            >
                              {team?.logo && (
                                <img src={team.logo} alt={team.name} />
                              )}

                              <span>{team?.name || "Unknown team"}</span>
                            </Link>
                          </td>

                          <td>{all?.played ?? "-"}</td>
                          <td>{all?.win ?? "-"}</td>
                          <td>{all?.draw ?? "-"}</td>
                          <td>{all?.lose ?? "-"}</td>
                          <td>{all?.goals?.for ?? "-"}</td>
                          <td>{all?.goals?.against ?? "-"}</td>
                          <td>{row.goalsDiff ?? "-"}</td>
                          <td>
                            <strong>{row.points ?? "-"}</strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
};
