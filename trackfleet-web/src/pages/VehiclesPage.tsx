import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, 
  DialogTitle, DialogContent, TextField, DialogActions, FormControl, 
  InputLabel, Select, MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import vehicleService, { Vehicle } from '../services/vehicleService';

const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    imei: '',
    status: 'Active'
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error) {
      console.error("Erro ao carregar veículos", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await vehicleService.create(formData);
      setOpen(false);
      setFormData({ plate: '', model: '', imei: '', status: 'Active' });
      loadVehicles();
    } catch (error) {
      alert('Erro ao salvar veículo. Verifique se a placa ou IMEI já existem.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await vehicleService.delete(id);
        loadVehicles();
      } catch (error) {
        console.error("Erro ao excluir", error);
      }
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <DirectionsCarIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight="bold" color="primary">
            Frota
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
        >
          Novo Veículo
        </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Modelo</strong></TableCell>
                <TableCell><strong>Placa</strong></TableCell>
                <TableCell><strong>IMEI (Rastreador)</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Nenhum veículo cadastrado.</TableCell>
                </TableRow>
              ) : (
                vehicles.map((v) => {
                  // 🔥 Correção Definitiva para seu Banco de Dados
                  const id = v.id || v.Id;
                  
                  // Mapeia Name ou TrackerModel (como visto no log)
                  const model = v.Name || v.TrackerModel || v.model || v.Model;
                  
                  // Mapeia LicensePlate (como visto no log)
                  const plate = v.LicensePlate || v.plate || v.Plate;
                  
                  const imei = v.imei || v.Imei;
                  
                  // Lógica para Status/IsActive
                  let statusLabel = 'Inativo';
                  let statusColor: 'success' | 'warning' | 'error' | 'default' = 'default';

                  if (v.IsActive === true || v.isActive === true) {
                    statusLabel = 'Ativo';
                    statusColor = 'success';
                  } else if (v.Status === 'Maintenance' || v.status === 'Maintenance') {
                    statusLabel = 'Manutenção';
                    statusColor = 'warning';
                  }

                  return (
                    <TableRow key={id} hover>
                      <TableCell>{model}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{plate}</TableCell>
                      <TableCell>{imei}</TableCell>
                      <TableCell>
                        <Chip 
                          label={statusLabel} 
                          color={statusColor} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" size="small"><EditIcon /></IconButton>
                        <IconButton color="error" size="small" onClick={() => handleDelete(id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cadastrar Veículo</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField 
              label="Modelo (ex: Fiat Uno)" 
              fullWidth 
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
            />
            <TextField 
              label="Placa (ex: ABC-1234)" 
              fullWidth 
              value={formData.plate}
              onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})}
            />
            <TextField 
              label="IMEI do Rastreador" 
              fullWidth 
              helperText="Número único do dispositivo GPS"
              value={formData.imei}
              onChange={(e) => setFormData({...formData, imei: e.target.value})}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <MenuItem value="Active">Ativo</MenuItem>
                <MenuItem value="Maintenance">Manutenção</MenuItem>
                <MenuItem value="Inactive">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? 'Salvar' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehiclesPage;