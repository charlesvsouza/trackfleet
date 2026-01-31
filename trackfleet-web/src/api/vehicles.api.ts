// src/api/vehicles.api.ts

import api from "./http";
import { Vehicle, CreateVehicleDTO } from "@/features/vehicles/types";

// =======================
// LISTAR VEÍCULOS
// =======================
export async function getVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get("/vehicles");
  return data;
}

// =======================
// CRIAR VEÍCULO
// =======================
export async function createVehicle(
  payload: CreateVehicleDTO
): Promise<Vehicle> {
  const { data } = await api.post("/vehicles", payload);
  return data;
}

// =======================
// ATUALIZAR VEÍCULO
// =======================
export async function updateVehicle(
  id: string,
  payload: CreateVehicleDTO
): Promise<Vehicle> {
  const { data } = await api.put(`/vehicles/${id}`, payload);
  return data;
}

// =======================
// REMOVER VEÍCULO
// =======================
export async function deleteVehicle(id: string): Promise<void> {
  await api.delete(`/vehicles/${id}`);
}
