import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/auth/useAuth";



export function RequireDriver({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin também pode acessar rotas de Driver
  if (user.role !== "Driver" && user.role !== "Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
