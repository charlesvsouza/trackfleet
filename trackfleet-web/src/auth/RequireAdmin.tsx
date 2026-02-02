import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";


import type { ReactNode } from "react";

interface RequireAdminProps {
  children: ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // ou spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
