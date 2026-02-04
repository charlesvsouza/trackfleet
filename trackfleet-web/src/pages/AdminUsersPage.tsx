import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
    DialogTitle, DialogContent, TextField, DialogActions, FormControl,
    InputLabel, Select, MenuItem, CircularProgress, Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import userService from '../services/userService'; // Importação corrigida

const AdminUsersPage: React.FC = () => {
    // Estados de Dados
    const [users, setUsers] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Estados de Modal e Operações
    const [open, setOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Estados de Feedback (Snackbar)
    const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Formulário
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const showFeedback = (message: string, severity: 'success' | 'error') => {
        setFeedback({ open: true, message, severity });
    };

    const loadUsers = async () => {
        setLoadingData(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Erro ao carregar usuários", error);
            showFeedback("Erro ao carregar lista de usuários.", "error");
        } finally {
            setLoadingData(false);
        }
    };

    const handleSave = async () => {
        // Validação simples
        if (!formData.name || !formData.email || !formData.password) {
            showFeedback("Preencha todos os campos obrigatórios.", "error");
            return;
        }

        if (formData.password.length < 6) {
            showFeedback("A senha deve ter pelo menos 6 caracteres.", "error");
            return;
        }

        setActionLoading(true);
        try {
            await userService.create(formData);
            showFeedback("Usuário criado com sucesso!", "success");
            setOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'User' }); // Limpa form
            loadUsers(); // Recarrega lista
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Erro ao criar usuário. Verifique se o email já existe.";
            showFeedback(msg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (email === 'admin@trackfleet.com') {
            showFeedback("O administrador principal não pode ser removido.", "error");
            return;
        }

        if (window.confirm(`Tem certeza que deseja remover o usuário ${email}?`)) {
            try {
                await userService.delete(id);
                showFeedback("Usuário removido.", "success");
                loadUsers();
            } catch (error) {
                showFeedback("Erro ao remover usuário.", "error");
            }
        }
    };

    return (
        <Box p={3}>
            {/* Cabeçalho */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            Gestão de Usuários
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gerencie administradores, motoristas e operadores.
                        </Typography>
                    </div>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    Novo Usuário
                </Button>
            </Box>

            {/* Tabela */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                <TableCell><strong>Nome</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Perfil</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Ações</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingData ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={24} /> Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        Nenhum usuário encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((u) => {
                                    // Normalização de dados (PascalCase vs camelCase)
                                    const id = u.id || u.Id;
                                    const name = u.name || u.Name;
                                    const email = u.email || u.Email;
                                    const role = u.role || u.Role;
                                    // Lógica para IsActive (pode vir bool ou int/string dependendo do banco)
                                    const isActive = (u.isActive !== undefined ? u.isActive : u.IsActive) === true;

                                    return (
                                        <TableRow key={id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{name}</TableCell>
                                            <TableCell>{email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={role === 'Admin' ? 'Administrador' : role === 'Driver' ? 'Motorista' : 'Usuário'}
                                                    color={role === 'Admin' ? 'primary' : role === 'Driver' ? 'warning' : 'default'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={isActive ? 'Ativo' : 'Inativo'}
                                                    color={isActive ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDelete(id, email)}
                                                    disabled={email === 'admin@trackfleet.com'}
                                                    title="Excluir usuário"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Modal de Cadastro */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Novo Usuário</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Preencha os dados abaixo para criar um novo acesso ao sistema.
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Nome Completo"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Email de Acesso"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            label="Senha Inicial"
                            type="password"
                            fullWidth
                            variant="outlined"
                            helperText="Mínimo de 6 caracteres"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Perfil de Acesso</InputLabel>
                            <Select
                                value={formData.role}
                                label="Perfil de Acesso"
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <MenuItem value="User">Usuário Comum (Visualização)</MenuItem>
                                <MenuItem value="Driver">Motorista (App Mobile)</MenuItem>
                                <MenuItem value="Admin">Administrador (Acesso Total)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={actionLoading}
                        startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {actionLoading ? 'Salvando...' : 'Criar Usuário'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Feedback Visual (Toasts) */}
            <Snackbar
                open={feedback.open}
                autoHideDuration={6000}
                onClose={() => setFeedback({ ...feedback, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={feedback.severity} variant="filled" sx={{ width: '100%' }}>
                    {feedback.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminUsersPage;