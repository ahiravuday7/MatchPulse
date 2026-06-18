import { useEffect, useMemo, useState } from "react";

import { footballService } from "../services/footballService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { SourceBadge } from "../components/common/SourceBadge";

import { TeamSearchCard } from "../components/football/TeamSearchCard";
import { LeagueSearchCard } from "../components/football/LeagueSearchCard";
import { PlayerSearchCard } from "../components/football/PlayerSearchCard";

const SEARCH_TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Teams",
    value: "team",
  },
  {
    label: "Leagues",
    value: "league",
  },
  {
    label: "Players",
    value: "player",
  },
];

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [players, setPlayers] = useState([]);

  const [sources, setSources] = useState({
    teams: null,
    leagues: null,
    players: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trimmedQuery = query.trim();
  const hasMinimumSearchLength = trimmedQuery.length >= 3;

  const totalResults = useMemo(() => {
    return teams.length + leagues.length + players.length;
  }, [teams, leagues, players]);

  const resetResults = () => {
    setTeams([]);
    setLeagues([]);
    setPlayers([]);

    setSources({
      teams: null,
      leagues: null,
      players: null,
    });
  };

  const searchData = async () => {
    if (!hasMinimumSearchLength) {
      resetResults();
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (activeTab === "player") {
        const playerResult = await footballService.searchPlayers({
          query: trimmedQuery,
          limit: 20,
        });

        setPlayers(playerResult.data || []);
        setTeams([]);
        setLeagues([]);

        setSources({
          teams: null,
          leagues: null,
          players: playerResult.source,
        });

        return;
      }

      if (activeTab === "all") {
        const [footballResult, playerResult] = await Promise.all([
          footballService.searchFootball({
            query: trimmedQuery,
            type: "all",
            limit: 10,
          }),
          footballService.searchPlayers({
            query: trimmedQuery,
            limit: 10,
          }),
        ]);

        setTeams(footballResult.data?.teams || []);
        setLeagues(footballResult.data?.leagues || []);
        setPlayers(playerResult.data || []);

        setSources({
          teams: footballResult.sources?.teams || null,
          leagues: footballResult.sources?.leagues || null,
          players: playerResult.source,
        });

        return;
      }

      const footballResult = await footballService.searchFootball({
        query: trimmedQuery,
        type: activeTab,
        limit: 10,
      });

      setTeams(footballResult.data?.teams || []);
      setLeagues(footballResult.data?.leagues || []);
      setPlayers([]);

      setSources({
        teams: footballResult.sources?.teams || null,
        leagues: footballResult.sources?.leagues || null,
        players: null,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to search football data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [trimmedQuery, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetResults();
    setError("");
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Search Football</h1>
          <p>Search teams, leagues, and players.</p>
        </div>

        <div className="page-actions">
          {sources.teams && <SourceBadge source={sources.teams} />}
          {sources.leagues && <SourceBadge source={sources.leagues} />}
          {sources.players && <SourceBadge source={sources.players} />}
        </div>
      </div>

      <div className="search-panel">
        <div className="search-input-row">
          <input
            type="search"
            value={query}
            placeholder="Search Ronaldo, Saka, Arsenal, Premier League..."
            className="search-input"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="search-tabs">
          {SEARCH_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={
                activeTab === tab.value ? "search-tab active" : "search-tab"
              }
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {!hasMinimumSearchLength && (
          <p className="search-hint">
            Enter at least 3 characters to start searching.
          </p>
        )}
      </div>

      {loading && <LoadingState message="Searching..." />}

      {!loading && error && <ErrorState message={error} onRetry={searchData} />}

      {!loading && !error && hasMinimumSearchLength && totalResults === 0 && (
        <EmptyState
          title="No results found"
          message="Try searching with a different keyword."
        />
      )}

      {!loading && !error && totalResults > 0 && (
        <div className="search-results">
          {players.length > 0 && (
            <section className="search-result-section">
              <h2>Players</h2>

              <div className="search-card-grid">
                {players.map((item) => (
                  <PlayerSearchCard key={item.player.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {teams.length > 0 && (
            <section className="search-result-section">
              <h2>Teams</h2>

              <div className="search-card-grid">
                {teams.map((team) => (
                  <TeamSearchCard key={team.id} team={team} />
                ))}
              </div>
            </section>
          )}

          {leagues.length > 0 && (
            <section className="search-result-section">
              <h2>Leagues</h2>

              <div className="search-card-grid">
                {leagues.map((league) => (
                  <LeagueSearchCard key={league.id} league={league} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
};

/* This page manages:

search input
active tab
season for players
teams result
leagues result
players result
loading state
error state
source badges */

/* query stores what user types.

activeTab stores selected tab: all, team, league, or player.

season is needed only for player search. */
