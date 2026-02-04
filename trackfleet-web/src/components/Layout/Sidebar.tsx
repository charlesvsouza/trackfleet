import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Divider, Typography, Box 
} from '@mui/material';

// Ícones
import MapIcon from '@mui/icons-material/Map';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsTruckIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Monitoramento', icon: <MapIcon />, path: '/' },
    { text: 'Usuários', icon: <PeopleIcon />, path: '/users' },
    { text: 'Veículos', icon: <DirectionsTruckIcon />, path: '/vehicles' },
    { text: 'Serviços', icon: <BuildIcon />, path: '/services' },
    { text: 'Financeiro', icon: <AttachMoneyIcon />, path: '/financial' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">
          TrackFleet
        </Typography>
      </Box>
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.main' }
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Sair" primaryTypographyProps={{ color: 'error' }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;