import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "../auth/RequireAuth"; 

// IMPORTAÇÕES PADRONIZADAS
import { LoginPage } from "../pages/LoginPage"; 
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { MapPage } from "../pages/MapPage";
import { AdminUsersPage } from "../pages/AdminUsersPage";
import { DriversPage } from "../pages/DriversPage"; // <--- NOVO

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Rota Protegida Principal (Dashboard/Mapa) */}
      <Route 
        path="/dashboard" 
        element={
          <RequireAuth>
            <MapPage />
          </RequireAuth>
        } 
      />

      {/* --- Rotas de Admin --- */}
      
      {/* Gestão de Usuários */}
      <Route 
        path="/admin/users" 
        element={
          <RequireAuth allowedRoles={['Admin']}>
            <AdminUsersPage />
          </RequireAuth>
        } 
      />

      {/* Gestão de Motoristas (NOVO) */}
      <Route 
        path="/admin/drivers" 
        element={
          <RequireAuth allowedRoles={['Admin']}>
            <DriversPage />
          </RequireAuth>
        } 
      />

      {/* Redirecionamento Padrão */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}