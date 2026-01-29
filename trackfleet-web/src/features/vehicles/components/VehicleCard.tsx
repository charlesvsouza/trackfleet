// src/features/vehicles/components/VehicleCard.tsx

import { Vehicle } from "../types";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8
      }}
    >
      <strong>{vehicle.name}</strong>
      <div>Placa: {vehicle.plate}</div>
      <div>Tipo: {vehicle.type}</div>
    </div>
  );
}
