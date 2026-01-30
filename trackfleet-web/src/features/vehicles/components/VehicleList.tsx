import { Vehicle } from "../types";

interface Props {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export function VehicleList({
  vehicles,
  selectedVehicleId,
  onSelect,
  onEdit,
  onDelete
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
            style={{
              padding: 12,
              borderRadius: 8,
              background: selected ? "#e3f2fd" : "#f5f7f9",
              border: selected
                ? "2px solid #1976d2"
                : "1px solid #e0e0e0"
            }}
          >
            <div
              onClick={() => onSelect(vehicle.id)}
              style={{ cursor: "pointer" }}
            >
              <strong style={{ fontSize: 14 }}>{vehicle.plate}</strong>
              {vehicle.description && (
                <div style={{ fontSize: 13, color: "#555" }}>
                  {vehicle.description}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 8
              }}
            >
              <button
                onClick={() => onEdit(vehicle)}
                style={actionButton("#1976d2")}
              >
                Editar
              </button>

              <button
                onClick={() => {
                  if (
                    confirm(
                      `Deseja remover o veículo ${vehicle.plate}?`
                    )
                  ) {
                    onDelete(vehicle.id);
                  }
                }}
                style={actionButton("#d32f2f")}
              >
                Remover
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function actionButton(color: string): React.CSSProperties {
  return {
    flex: 1,
    padding: "6px",
    fontSize: 12,
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  };
}
