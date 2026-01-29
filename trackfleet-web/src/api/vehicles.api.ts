// src/api/vehicles.api.ts

import api from "./http";
import { Vehicle, CreateVehicleDTO } from "@/features/vehicles/types";

export async function getVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get("/vehicles");
  return data;
}

export async function createVehicle(
  payload: CreateVehicleDTO
): Promise<Vehicle> {
  const { data } = await api.post("/vehicles", payload);
  return data;
}
