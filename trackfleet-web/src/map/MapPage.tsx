import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function MapPage() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      MAPA
    </div>
  );
}
