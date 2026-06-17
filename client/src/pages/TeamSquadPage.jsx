import { useParams } from "react-router-dom";

export const TeamSquadPage = () => {
  const { teamId } = useParams();

  return (
    <section className="page">
      <h1>Team Squad</h1>
      <p>Team ID: {teamId}</p>
    </section>
  );
};
