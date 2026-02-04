import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './routes/PrivateRoute'; // Confirme o caminho na sua pasta routes

// Páginas
import LoginPage from './pages/LoginPage';
import MapScreen from './screens/MapScreen'; // A tela do Mapa que criamos
import AdminUsersPage from './pages/AdminUsersPage'; // A tela de usuários que já funcionou

// Placeholder para páginas futuras (para não dar erro)
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: 20 }}><h1>{title}</h1><p>Em construção...</p></div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Protegidas com Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
            
            {/* Home = Mapa */}
            <Route path="/" element={<MapScreen />} />
            
            {/* Outras Telas */}
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/vehicles" element={<PlaceholderPage title="Veículos" />} />
            <Route path="/services" element={<PlaceholderPage title="Serviços" />} />
            <Route path="/financial" element={<PlaceholderPage title="Financeiro" />} />

        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;