// src/routes/PrivateRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 🔄 Aguarda o AuthContext inicializar
  if (loading) {
    return <p style={{ padding: 20 }}>Verificando autenticação...</p>;
  }

  // 🔒 Não autenticado → login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ✅ Autenticado → renderiza rota protegida
  return <>{children}</>;
}
