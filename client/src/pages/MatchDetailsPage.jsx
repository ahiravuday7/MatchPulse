import { useParams } from "react-router-dom";

export const MatchDetailsPage = () => {
  const { matchId } = useParams();

  return (
    <section className="page">
      <h1>Match Details</h1>
      <p>Match ID: {matchId}</p>
    </section>
  );
};
