import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { authService } from "../services/authService";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/favorites";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await authService.login(formData);

      window.dispatchEvent(new Event("auth-change"));

      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p>Login to save your favorite teams, leagues, and players.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          New to MatchPulse? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};
