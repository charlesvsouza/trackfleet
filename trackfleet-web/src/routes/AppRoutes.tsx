import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../auth/LoginPage';
import MapPage from '../map/MapPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
