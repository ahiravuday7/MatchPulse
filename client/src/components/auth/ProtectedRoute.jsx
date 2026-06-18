import { Navigate, useLocation } from "react-router-dom";

import { authService } from "../../services/authService";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
};
// /favorites and /profile cannot be opened directly without login.
