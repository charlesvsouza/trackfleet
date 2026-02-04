import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Confirme se o caminho está certo

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>; // Ou um Spinner bonito
  }

  // Se logado, mostra o conteúdo (Outlet). Se não, manda pro login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// 🔥 ADICIONE ISTO NO FINAL PARA CORRIGIR O ERRO
export default PrivateRoute;