import api from './api';

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  imei: string; // Importante para o rastreador
  status: 'Active' | 'Maintenance' | 'Inactive';
  lastLatitude?: number;
  lastLongitude?: number;
}

export interface CreateVehicleDto {
  plate: string;
  model: string;
  imei: string;
  status: string;
}

const vehicleService = {
  getAll: async () => {
    const response = await api.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  create: async (data: CreateVehicleDto) => {
    const response = await api.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateVehicleDto>) => {
    // Ajuste conforme seu backend (pode ser PUT ou PATCH)
    const response = await api.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/vehicles/${id}`);
  }
};

export default vehicleService;