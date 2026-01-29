// src/map/mockPositions.ts

import { Vehicle } from "@/features/vehicles/types";

const BASE_LAT = -22.9068;
const BASE_LNG = -43.1729;

export function attachMockPositions(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.map((v, index) => ({
    ...v,
    position: {
      lat: BASE_LAT + index * 0.01,
      lng: BASE_LNG + index * 0.01
    }
  }));
}
