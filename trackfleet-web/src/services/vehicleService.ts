// src/services/vehicleService.ts

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from "@/api/vehicles.api";

import { Vehicle, CreateVehicleDTO } from "@/features/vehicles/types";

export const vehicleService = {
  // =======================
  // LISTAR
  // =======================
  async list(): Promise<Vehicle[]> {
    return getVehicles();
  },

  // =======================
  // CRIAR
  // =======================
  async create(payload: CreateVehicleDTO): Promise<Vehicle> {
    return createVehicle(payload);
  },

  // =======================
  // ATUALIZAR
  // =======================
  async update(
    id: string,
    payload: CreateVehicleDTO
  ): Promise<Vehicle> {
    return updateVehicle(id, payload);
  },

  // =======================
  // REMOVER
  // =======================
  async remove(id: string): Promise<void> {
    await deleteVehicle(id);
  }
};
