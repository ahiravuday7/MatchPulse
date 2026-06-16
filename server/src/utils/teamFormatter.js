export const formatTeamDetails = ({ teamInfoResponse, fixturesResponse }) => {
  const teamData = teamInfoResponse.response?.[0];

  if (!teamData) {
    return null;
  }

  const fixtures = fixturesResponse.response || [];

  const upcomingFixtures = fixtures.filter(
    (fixture) => fixture.fixture.status.short === "NS",
  );

  const recentFixtures = fixtures.filter((fixture) =>
    ["FT", "AET", "PEN"].includes(fixture.fixture.status.short),
  );

  return {
    team: {
      id: teamData.team.id,
      name: teamData.team.name,
      code: teamData.team.code,
      country: teamData.team.country,
      founded: teamData.team.founded,
      national: teamData.team.national,
      logo: teamData.team.logo,
    },

    venue: {
      id: teamData.venue?.id,
      name: teamData.venue?.name,
      address: teamData.venue?.address,
      city: teamData.venue?.city,
      capacity: teamData.venue?.capacity,
      surface: teamData.venue?.surface,
      image: teamData.venue?.image,
    },

    upcomingFixtures,
    recentFixtures,
  };
};

// Team Formatter
// Purpose:
// API-Football response is large and messy.
// Formatter converts it into clean frontend data.
