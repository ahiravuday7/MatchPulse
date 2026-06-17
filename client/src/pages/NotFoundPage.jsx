import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <section className="page">
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>

      <Link to="/" className="button">
        Go Home
      </Link>
    </section>
  );
};
