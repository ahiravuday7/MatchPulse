import { Routes, Route } from "react-router-dom";

import { MainLayout } from "../components/layout/MainLayout";

import { HomePage } from "../pages/HomePage";
import { LiveMatchesPage } from "../pages/LiveMatchesPage";
import { TodayFixturesPage } from "../pages/TodayFixturesPage";
import { FinishedMatchesPage } from "../pages/FinishedMatchesPage";
import { MatchDetailsPage } from "../pages/MatchDetailsPage";
import { LeagueStandingsPage } from "../pages/LeagueStandingsPage";
import { TeamDetailsPage } from "../pages/TeamDetailsPage";
import { TeamSquadPage } from "../pages/TeamSquadPage";
import { TeamPlayersPage } from "../pages/TeamPlayersPage";
import { PlayerDetailsPage } from "../pages/PlayerDetailsPage";
import { FavoritesPage } from "../pages/FavoritesPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProfilePage } from "../pages/ProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { SearchPage } from "../pages/SearchPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/live" element={<LiveMatchesPage />} />
        <Route path="/fixtures" element={<TodayFixturesPage />} />
        <Route path="/finished" element={<FinishedMatchesPage />} />

        <Route path="/matches/:matchId" element={<MatchDetailsPage />} />

        <Route
          path="/leagues/:leagueId/standings"
          element={<LeagueStandingsPage />}
        />

        <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
        <Route path="/teams/:teamId/squad" element={<TeamSquadPage />} />
        <Route path="/teams/:teamId/players" element={<TeamPlayersPage />} />

        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/players" element={<SearchPage />} />
        <Route path="/players/:playerId" element={<PlayerDetailsPage />} />

        <Route path="/favorites" element={<FavoritesPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

// Defines all pages.
