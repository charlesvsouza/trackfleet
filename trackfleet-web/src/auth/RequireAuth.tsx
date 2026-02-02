// src/auth/RequireAuth.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth"; // ✅ CERTO: Mesmo diretório (src/auth)

// ... resto do código igual ao anterior

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. SOLUÇÃO DO BUG: Impede o redirect enquanto o React ainda está pensando
  if (loading) {
    return (
      // Feedback visual profissional enquanto carrega
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#666'
      }}>
        Verificando credenciais...
      </div>
    );
  }

  // 2. Se não está autenticado, manda pro Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Verifica Permissões (Roles)
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}