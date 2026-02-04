import React, { useState } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Se tiver componentes de formulário, importe-os aqui
// import UserFormModal from '../components/UserFormModal';

const AdminUsersPage: React.FC = () => {
  // Mock de dados para teste visual
  const [users] = useState([
    { id: 1, name: 'Admin Teste', email: 'admin@trackfleet.com', role: 'Administrador', status: 'Ativo' },
    { id: 2, name: 'Operador 01', email: 'op1@trackfleet.com', role: 'Operador', status: 'Ativo' },
  ]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Gestão de Usuários
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          color="primary"
        >
          Novo Usuário
        </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Perfil</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} color="primary" variant="outlined" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={user.status === 'Ativo' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

// 🔥 ESTE É O COMANDO MÁGICO QUE FAZ O IMPORT FUNCIONAR
export default AdminUsersPage;