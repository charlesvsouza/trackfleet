import { http } from "./http";

export interface VehicleDto {
  id: string;
  plate: string;
  description?: string;
  latitude: number;
  longitude: number;
  lastUpdateUtc: string;
  isActive: boolean;
}

export async function getVehicles(): Promise<VehicleDto[]> {
  const response = await http.get<VehicleDto[]>("/vehicles");
  return response.data;
}
