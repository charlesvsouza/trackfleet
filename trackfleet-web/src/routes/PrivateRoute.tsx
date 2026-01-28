import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type PrivateRouteProps = {
  children: React.ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
