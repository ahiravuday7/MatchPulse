import { useParams } from "react-router-dom";

export const TeamPlayersPage = () => {
  const { teamId } = useParams();

  return (
    <section className="page">
      <h1>Team Players</h1>
      <p>Team ID: {teamId}</p>
    </section>
  );
};
