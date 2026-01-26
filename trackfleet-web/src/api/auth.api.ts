import api from './axios';

export async function login(
  tenantId: string,
  email: string,
  password: string
) {
  const response = await api.post('/api/auth/login', {
    tenantId,
    email,
    password
  });

  return response.data as {
    token: string;
    expiresAtUtc: string;
  };
}
