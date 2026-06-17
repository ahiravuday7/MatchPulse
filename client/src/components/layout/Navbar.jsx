import { NavLink } from "react-router-dom";

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
    path: "/search/players",
  },
  {
    label: "Favorites",
    path: "/favorites",
  },
];

export const Navbar = () => {
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
        <NavLink to="/login" className="nav-link">
          Login
        </NavLink>

        <NavLink to="/register" className="nav-link primary-link">
          Register
        </NavLink>
      </div>
    </header>
  );
};
