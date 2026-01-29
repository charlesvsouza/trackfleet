// src/features/vehicles/components/VehicleList.tsx

import { Vehicle } from "../types";
import { VehicleCard } from "./VehicleCard";

interface VehicleListProps {
  vehicles: Vehicle[];
  loading?: boolean;
}

export function VehicleList({ vehicles, loading }: VehicleListProps) {
  if (loading) {
    return <p>Carregando veículos...</p>;
  }

  if (!vehicles.length) {
    return <p>Nenhum veículo cadastrado.</p>;
  }

  return (
    <div>
      <h2>Veículos</h2>

      {vehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
