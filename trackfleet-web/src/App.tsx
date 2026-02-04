import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './routes/PrivateRoute';

// Páginas Reais
import LoginPage from './pages/LoginPage';
import MapScreen from './screens/MapScreen';
import AdminUsersPage from './pages/AdminUsersPage';
import VehiclesPage from './pages/VehiclesPage'; // <--- Nova Importação

// Placeholder apenas para as telas que faltam
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: 20 }}>
    <h1>{title}</h1>
    <p>Em construção...</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Protegidas (Exigem Login) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
            
            {/* Dashboard / Mapa */}
            <Route path="/" element={<MapScreen />} />
            
            {/* Cadastros */}
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} /> {/* <--- Rota Atualizada */}
            
            {/* Futuro */}
            <Route path="/services" element={<PlaceholderPage title="Serviços e Manutenção" />} />
            <Route path="/financial" element={<PlaceholderPage title="Financeiro" />} />

        </Route>
      </Route>

      {/* Rota pega-tudo redireciona para Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;