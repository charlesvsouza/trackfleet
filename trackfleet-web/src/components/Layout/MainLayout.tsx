import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CssBaseline />
      
      {/* Menu Lateral Fixo */}
      <Sidebar />

      {/* Conteúdo da Página */}
      <Box component="main" sx={{ flexGrow: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;