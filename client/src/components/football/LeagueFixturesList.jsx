import { LeagueMatchGroup } from "./LeagueMatchGroup";
import { EmptyState } from "../common/EmptyState";

export const LeagueFixturesList = ({
  leagueGroups = [],
  emptyTitle,
  emptyMessage,
}) => {
  if (leagueGroups.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="league-list">
      {leagueGroups.map((group) => (
        <LeagueMatchGroup
          key={group.league.id || group.league.name}
          league={group.league}
          fixtures={group.fixtures}
        />
      ))}
    </div>
  );
};

// Instead of repeating the same UI in Today and Finished pages, create one reusable component.
