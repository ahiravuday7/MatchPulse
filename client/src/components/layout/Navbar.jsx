import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { authService } from "../../services/authService";

const navItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Live",
    path: "/live",
  },
  {
    label: "Fixtures",
    path: "/fixtures",
  },
  {
    label: "Finished",
    path: "/finished",
  },
  {
    label: "Search",
    path: "/search",
  },
  {
    label: "Favorites",
    path: "/favorites",
  },
];

export const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(authService.isLoggedIn());
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();

    window.dispatchEvent(new Event("auth-change"));

    navigate("/login");
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        MatchPulse
      </NavLink>

      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="auth-links">
        {isLoggedIn ? (
          <button
            type="button"
            className="nav-link primary-link logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>

            <NavLink to="/register" className="nav-link primary-link">
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};
