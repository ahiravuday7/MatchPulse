import { useEffect, useMemo, useState } from "react";

import { footballService } from "../services/footballService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { SourceBadge } from "../components/common/SourceBadge";

import { TeamSearchCard } from "../components/football/TeamSearchCard";
import { LeagueSearchCard } from "../components/football/LeagueSearchCard";
import { PlayerSearchCard } from "../components/football/PlayerSearchCard";

import { createFallbackSeasonOptions } from "../utils/seasonUtils";

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

const PLAYER_LEAGUES = [
  {
    id: 39,
    name: "Premier League",
  },
  {
    id: 140,
    name: "La Liga",
  },
  {
    id: 78,
    name: "Bundesliga",
  },
  {
    id: 135,
    name: "Serie A",
  },
  {
    id: 61,
    name: "Ligue 1",
  },
  {
    id: 2,
    name: "Champions League",
  },
  {
    id: 253,
    name: "MLS",
  },
];

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [season, setSeason] = useState(2025);
  const [seasonOptions, setSeasonOptions] = useState(
    createFallbackSeasonOptions({ leagueId: 39 }),
  );
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [leagueId, setLeagueId] = useState(39);

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

  const hasMinimumSearchLength = trimmedQuery.length >= 3; //So search starts only when user enters at least 3 characters.

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
          season,
          leagueId,
          limit: 10,
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
  }, [trimmedQuery, activeTab, season, leagueId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetResults();
    setError("");
  };

  const fetchLeagueSeasons = async (selectedLeagueId) => {
    try {
      setSeasonLoading(true);

      const result = await footballService.getLeagueSeasons(selectedLeagueId);

      const seasons = result.data?.seasons || [];

      if (seasons.length > 0) {
        setSeasonOptions(seasons);
        setSeason(seasons[0].value);
      } else {
        const fallback = createFallbackSeasonOptions({
          leagueId: selectedLeagueId,
        });

        setSeasonOptions(fallback);
        setSeason(fallback[0].value);
      }
    } catch {
      const fallback = createFallbackSeasonOptions({
        leagueId: selectedLeagueId,
      });

      setSeasonOptions(fallback);
      setSeason(fallback[0].value);
    } finally {
      setSeasonLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === "player") {
      fetchLeagueSeasons(leagueId);
    }
  }, [activeTab, leagueId]);

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
            placeholder="Search Arsenal, Premier League, Saka..."
            className="search-input"
            onChange={(event) => setQuery(event.target.value)}
          />

          {activeTab === "player" && (
            <>
              <select
                className="season-select"
                value={season}
                disabled={seasonLoading}
                onChange={(event) => setSeason(Number(event.target.value))}
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
                onChange={(event) => setLeagueId(Number(event.target.value))}
              >
                {PLAYER_LEAGUES.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </>
          )}
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

          {players.length > 0 && (
            <section className="search-result-section">
              <h2>Players</h2>

              <div className="search-card-grid">
                {players.map((item) => (
                  <PlayerSearchCard
                    key={item.player.id}
                    item={item}
                    season={season}
                    leagueId={leagueId}
                  />
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
