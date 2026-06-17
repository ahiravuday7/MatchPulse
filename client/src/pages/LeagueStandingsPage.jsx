import { useParams } from "react-router-dom";

export const LeagueStandingsPage = () => {
  const { leagueId } = useParams();

  return (
    <section className="page">
      <h1>League Standings</h1>
      <p>League ID: {leagueId}</p>
    </section>
  );
};
