// src/routes/AppRoutes.tsx
// src/routes/AppRoutes.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../auth/LoginPage";
import { MapPage } from "../pages/MapPage";
import { PrivateRoute } from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* rota pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* rota protegida */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MapPage />
          </PrivateRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
