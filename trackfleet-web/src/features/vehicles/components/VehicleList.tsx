import { useState } from "react";
import { Vehicle } from "../types";

interface Props {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, data: Partial<Vehicle>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function VehicleList({
  vehicles,
  selectedVehicleId,
  onSelect,
  onUpdate,
  onDelete
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [plate, setPlate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  function startEdit(vehicle: Vehicle) {
    setEditingId(vehicle.id);
    setPlate(vehicle.plate);
    setDescription(vehicle.description ?? "");
  }

  async function saveEdit(id: string) {
    setLoading(true);
    await onUpdate(id, { plate, description });
    setLoading(false);
    setEditingId(null);
  }

  async function remove(id: string) {
    const ok = window.confirm("Deseja realmente remover este veículo?");
    if (!ok) return;
    await onDelete(id);
  }

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
        const editing = vehicle.id === editingId;

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
            {!editing ? (
              <>
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
                    marginTop: 8,
                    display: "flex",
                    gap: 8
                  }}
                >
                  <button
                    onClick={() => startEdit(vehicle)}
                    style={btnSecondary}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => remove(vehicle.id)}
                    style={btnDanger}
                  >
                    🗑️ Remover
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  value={plate}
                  onChange={e => setPlate(e.target.value)}
                  placeholder="Placa"
                  style={inputStyle}
                />
                <input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descrição"
                  style={inputStyle}
                />

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 8
                  }}
                >
                  <button
                    onClick={() => saveEdit(vehicle.id)}
                    disabled={loading}
                    style={btnPrimary}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={btnSecondary}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// =======================
// STYLES
// =======================

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  marginTop: 4,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14
};

const btnPrimary: React.CSSProperties = {
  padding: "6px 10px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13
};

const btnSecondary: React.CSSProperties = {
  padding: "6px 10px",
  background: "#e0e0e0",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13
};

const btnDanger: React.CSSProperties = {
  padding: "6px 10px",
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13
};
