import { useEffect, useState } from "react";

import { footballService } from "../services/footballService";
import { groupMatchesByLeague } from "../utils/groupMatches";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { SourceBadge } from "../components/common/SourceBadge";
import { LeagueMatchGroup } from "../components/football/LeagueMatchGroup";

export const LiveMatchesPage = () => {
  const [leagueGroups, setLeagueGroups] = useState([]);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await footballService.getLiveMatches();

      const groupedMatches = groupMatchesByLeague(result.fixtures);

      setLeagueGroups(groupedMatches);
      setSource(result.source);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load live matches",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  if (loading) {
    return <LoadingState message="Loading live matches..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchLiveMatches} />;
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Live Matches</h1>
          <p>Track currently live football matches.</p>
        </div>

        <div className="page-actions">
          <SourceBadge source={source} />

          <button
            type="button"
            className="button secondary-button"
            onClick={fetchLiveMatches}
          >
            Refresh
          </button>
        </div>
      </div>

      {leagueGroups.length === 0 ? (
        <EmptyState
          title="No live matches right now"
          message="There are currently no live matches available."
        />
      ) : (
        <div className="league-list">
          {leagueGroups.map((group) => (
            <LeagueMatchGroup
              key={group.league.id || group.league.name}
              league={group.league}
              fixtures={group.fixtures}
            />
          ))}
        </div>
      )}
    </section>
  );
};
