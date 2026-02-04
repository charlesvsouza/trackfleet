import api from './api';

// Interfaces exportadas individualmente
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Driver' | 'User';
  isActive: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  role: string;
}

// Objeto do serviço
const userService = {
  getAll: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  create: async (data: CreateUserDto) => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  }
};

// 🔥 A CORREÇÃO ESTÁ AQUI EMBAIXO:
export default userService;