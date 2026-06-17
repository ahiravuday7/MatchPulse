import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { footballService } from "../services/footballService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { SourceBadge } from "../components/common/SourceBadge";

import { MatchHeader } from "../components/football/MatchHeader";
import { MatchEventsTimeline } from "../components/football/MatchEventsTimeline";
import { MatchStatistics } from "../components/football/MatchStatistics";

export const MatchDetailsPage = () => {
  const { matchId } = useParams();

  const [matchDetails, setMatchDetails] = useState(null);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await footballService.getMatchDetails(matchId);

      setMatchDetails(result.data);
      setSource(result.source);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load match details",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  if (loading) {
    return <LoadingState message="Loading match details..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchMatchDetails} />;
  }

  if (!matchDetails?.fixture) {
    return (
      <EmptyState
        title="Match not found"
        message="No details are available for this match."
      />
    );
  }

  const fixture = matchDetails.fixture;
  const homeTeamId = fixture.teams?.home?.id;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <Link to="/fixtures" className="back-link">
            ← Back to fixtures
          </Link>

          <h1>Match Details</h1>
        </div>

        <div className="page-actions">
          <SourceBadge source={source} />

          <button
            type="button"
            className="button secondary-button"
            onClick={fetchMatchDetails}
          >
            Refresh
          </button>
        </div>
      </div>

      <MatchHeader match={fixture} />

      <div className="match-details-grid">
        <MatchEventsTimeline
          events={matchDetails.events}
          homeTeamId={homeTeamId}
        />

        <MatchStatistics statistics={matchDetails.statistics} />
      </div>
    </section>
  );
};

/* It does 5 main things.

Gets matchId from URL
Stores page state
Calls backend API
Handles loading/error/empty state
Renders the final UI */
