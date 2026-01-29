// src/features/vehicles/types.ts

export type VehicleType = "Car" | "Truck" | "Motorcycle" | "Other";

export interface VehiclePosition {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  type: VehicleType;
  createdAt: string;
  position?: VehiclePosition;
}



export interface CreateVehicleDTO {
  name: string;
  plate: string;
  type: VehicleType;
}
