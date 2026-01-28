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
        {/* Se autenticado, redireciona login para home */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* Rota protegida */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MapPage />
            </PrivateRoute>
          }
        />

        {/* Redireciona rotas desconhecidas para login se não autenticado */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
