import api from './api';

// Tipos baseados no que seu Backend espera e retorna
export interface LoginRequest {
  email: string;
  password?: string; // Opcional se for Google, mas aqui focaremos no login normal
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const authService = {
  // Chama o endpoint POST /api/auth/login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Logout apenas limpa localmente
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Verifica se tem token salvo
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};

export default authService;