import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { footballService } from "../services/footballService";

import { FavoriteButton } from "../components/common/FavoriteButton";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

const DEFAULT_SEASON = 2024;

export const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const seasonFromUrl = Number(searchParams.get("season")) || DEFAULT_SEASON;

  const [teamDetails, setTeamDetails] = useState(null);
  const [season, setSeason] = useState(seasonFromUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTeamDetails = async () => {
    if (!teamId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await footballService.getTeamDetails({
        teamId,
        season,
      });

      setTeamDetails(result);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load team details",
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
    fetchTeamDetails();
  }, [teamId, season]);

  const data = teamDetails?.data || teamDetails;
  const team = data?.team;
  const venue = data?.venue;

  const teamFavorite = team?.id
    ? {
        type: "team",
        externalId: Number(team.id),
        name: team.name,
        logo: team.logo || "",
        country: team.country || "",
        meta: {
          code: team.code || "",
          founded: team.founded || "",
          national: team.national || false,
          venueName: venue?.name || "",
          venueCity: venue?.city || "",
          season,
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
          <h1>{team?.name || "Team Details"}</h1>

          <p>
            {team?.country || "Team information"}
            {team?.founded ? ` • Founded ${team.founded}` : ""}
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

          {teamFavorite && <FavoriteButton favorite={teamFavorite} />}
        </div>
      </div>

      {loading && <LoadingState message="Loading team details..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchTeamDetails} />
      )}

      {!loading && !error && !team && (
        <EmptyState
          title="Team not found"
          message="We could not find details for this team."
        />
      )}

      {!loading && !error && team && (
        <div className="team-details-layout">
          <section className="team-profile-card">
            <div className="team-profile-main">
              <div className="team-profile-logo">
                {team.logo && <img src={team.logo} alt={team.name} />}
              </div>

              <div>
                <h2>{team.name}</h2>

                <p>
                  {team.country || "Unknown country"}
                  {team.code ? ` • ${team.code}` : ""}
                </p>

                <span>{team.national ? "National Team" : "Club Team"}</span>
              </div>
            </div>

            <div className="team-profile-meta">
              <div className="player-stat-tile">
                <span>Country</span>
                <strong>{team.country || "-"}</strong>
              </div>

              <div className="player-stat-tile">
                <span>Founded</span>
                <strong>{team.founded || "-"}</strong>
              </div>

              <div className="player-stat-tile">
                <span>Code</span>
                <strong>{team.code || "-"}</strong>
              </div>

              <div className="player-stat-tile">
                <span>Type</span>
                <strong>{team.national ? "National" : "Club"}</strong>
              </div>
            </div>
          </section>

          {venue && (
            <section className="team-profile-card">
              <h2>Venue</h2>

              <div className="team-venue-layout">
                {venue.image && (
                  <div className="team-venue-image">
                    <img src={venue.image} alt={venue.name} />
                  </div>
                )}

                <div className="team-profile-meta">
                  <div className="player-stat-tile">
                    <span>Stadium</span>
                    <strong>{venue.name || "-"}</strong>
                  </div>

                  <div className="player-stat-tile">
                    <span>City</span>
                    <strong>{venue.city || "-"}</strong>
                  </div>

                  <div className="player-stat-tile">
                    <span>Capacity</span>
                    <strong>{venue.capacity || "-"}</strong>
                  </div>

                  <div className="player-stat-tile">
                    <span>Surface</span>
                    <strong>{venue.surface || "-"}</strong>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
};
