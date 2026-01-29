// src/services/vehicleService.ts

import { getVehicles, createVehicle } from "@/api/vehicles.api";
import { Vehicle, CreateVehicleDTO } from "@/features/vehicles/types";

export const vehicleService = {
  async list(): Promise<Vehicle[]> {
    return await getVehicles();
  },

  async create(payload: CreateVehicleDTO): Promise<Vehicle> {
    return await createVehicle(payload);
  }
};
