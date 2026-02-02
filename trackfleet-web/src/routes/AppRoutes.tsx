import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "../auth/RequireAuth"; 

// IMPORTAÇÕES PADRONIZADAS (Todas com chaves {})
import { LoginPage } from "../pages/LoginPage"; 
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { MapPage } from "../pages/MapPage";
import { AdminUsersPage } from "../pages/AdminUsersPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Rota Protegida Principal */}
      <Route 
        path="/dashboard" 
        element={
          <RequireAuth>
            <MapPage />
          </RequireAuth>
        } 
      />

      {/* Rota Protegida de Admin */}
      <Route 
        path="/admin/users" 
        element={
          <RequireAuth allowedRoles={['Admin']}>
            <AdminUsersPage />
          </RequireAuth>
        } 
      />

      {/* Redirecionamento Padrão */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}