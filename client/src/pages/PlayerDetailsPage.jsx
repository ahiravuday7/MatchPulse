import { useParams } from "react-router-dom";

export const PlayerDetailsPage = () => {
  const { playerId } = useParams();

  return (
    <section className="page">
      <h1>Player Details</h1>
      <p>Player ID: {playerId}</p>
    </section>
  );
};
