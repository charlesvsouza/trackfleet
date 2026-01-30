import { Vehicle } from "../types";

interface Props {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
}

export function VehicleList({
  vehicles,
  selectedVehicleId,
  onSelect
}: Props) {
  if (vehicles.length === 0) {
    return <p style={{ fontSize: 14, color: "#777" }}>Nenhum veículo.</p>;
  }

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}
    >
      {vehicles.map(vehicle => {
        const selected = vehicle.id === selectedVehicleId;

        return (
          <li
            key={vehicle.id}
            onClick={() => onSelect(vehicle.id)}
            style={{
              padding: 12,
              borderRadius: 8,
              cursor: "pointer",
              background: selected ? "#e3f2fd" : "#f5f7f9",
              border: selected
                ? "2px solid #1976d2"
                : "1px solid #e0e0e0"
            }}
          >
            <strong style={{ fontSize: 14 }}>{vehicle.plate}</strong>
            {vehicle.description && (
              <div style={{ fontSize: 13, color: "#555" }}>
                {vehicle.description}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
