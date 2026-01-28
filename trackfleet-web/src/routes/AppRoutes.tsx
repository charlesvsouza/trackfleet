import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../auth/LoginPage";
import MapPage from "../map/MapPage";
import { PrivateRoute } from "./PrivateRoute";
import { useAuth } from "../auth/AuthContext";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MapPage />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
