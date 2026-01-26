import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { login as loginApi } from '../api/auth.api';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [tenantId, setTenantId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async () => {
    try {
      setError('');
      const result = await loginApi(tenantId, email, password);
      auth.login(result.token);
      navigate('/');
    } catch {
      setError('Credenciais inválidas');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Typography variant="h5" gutterBottom>
          TrackFleet Login
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Tenant ID"
          value={tenantId}
          onChange={e => setTenantId(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Entrar
        </Button>
      </Box>
    </Container>
  );
}
