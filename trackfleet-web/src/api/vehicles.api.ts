// src/api/vehicles.api.ts

import api from "./http"; // Certifique-se que este arquivo existe e exporta a instância do Axios
import { Vehicle, CreateVehicleDTO } from "@/features/vehicles/types";

// =======================
// LISTAR VEÍCULOS
// =======================
export async function getVehicles(): Promise<Vehicle[]> {
  // CORREÇÃO: Adicionado prefixo /api
  const { data } = await api.get("/api/vehicles"); 
  return data;
}

// =======================
// CRIAR VEÍCULO
// =======================
export async function createVehicle(
  payload: CreateVehicleDTO
): Promise<Vehicle> {
  const { data } = await api.post("/api/vehicles", payload);
  return data;
}

// =======================
// ATUALIZAR VEÍCULO
// =======================
export async function updateVehicle(
  id: string,
  payload: CreateVehicleDTO
): Promise<Vehicle> {
  const { data } = await api.put(`/api/vehicles/${id}`, payload);
  return data;
}

// =======================
// REMOVER VEÍCULO
// =======================
export async function deleteVehicle(id: string): Promise<void> {
  await api.delete(`/api/vehicles/${id}`);
}