import { useParams } from "react-router-dom";

export const TeamDetailsPage = () => {
  const { teamId } = useParams();

  return (
    <section className="page">
      <h1>Team Details</h1>
      <p>Team ID: {teamId}</p>
    </section>
  );
};
