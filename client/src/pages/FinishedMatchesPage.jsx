import { useEffect, useState } from "react";

import { footballService } from "../services/footballService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { SourceBadge } from "../components/common/SourceBadge";
import { LeagueFixturesList } from "../components/football/LeagueFixturesList";

export const FinishedMatchesPage = () => {
  const [leagueGroups, setLeagueGroups] = useState([]);
  const [source, setSource] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFinishedMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await footballService.getFinishedMatches();

      setLeagueGroups(result.leagues);
      setSource(result.source);
      setDate(result.date);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load finished matches",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinishedMatches();
  }, []);

  if (loading) {
    return <LoadingState message="Loading finished matches..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchFinishedMatches} />;
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Finished Matches</h1>
          <p>
            Completed football matches for today.
            {date && <span className="page-date"> Date: {date}</span>}
          </p>
        </div>

        <div className="page-actions">
          <SourceBadge source={source} />

          <button
            type="button"
            className="button secondary-button"
            onClick={fetchFinishedMatches}
          >
            Refresh
          </button>
        </div>
      </div>

      <LeagueFixturesList
        leagueGroups={leagueGroups}
        emptyTitle="No finished matches yet"
        emptyMessage="There are no completed matches available yet."
      />
    </section>
  );
};
