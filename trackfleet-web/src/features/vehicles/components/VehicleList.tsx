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
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function startEdit(vehicle: Vehicle) {
    setEditingId(vehicle.id);
    setPlate(vehicle.plate);
  }

  async function saveEdit(id: string) {
    try {
      setLoadingId(id);
      await onUpdate(id, { plate });
      setEditingId(null);
    } finally {
      setLoadingId(null);
    }
  }

  async function remove(id: string) {
    const ok = window.confirm(
      "Tem certeza que deseja remover este veículo?\nEsta ação não poderá ser desfeita."
    );

    if (!ok) return;

    setLoadingId(id);
    await onDelete(id);
    setLoadingId(null);
  }

  if (vehicles.length === 0) {
    return <p style={{ fontSize: 13 }}>Nenhum veículo cadastrado.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {vehicles.map(v => {
        const selected = v.id === selectedVehicleId;
        const editing = v.id === editingId;
        const loading = v.id === loadingId;

        return (
          <li
            key={v.id}
            style={{
              padding: 12,
              borderRadius: 8,
              border: selected
                ? "2px solid #1976d2"
                : "1px solid #ddd",
              marginBottom: 8,
              background: "#fafafa"
            }}
          >
            {!editing ? (
              <>
                <div
                  onClick={() => onSelect(v.id)}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{v.plate}</strong>
                </div>

                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => startEdit(v)}
                    disabled={loading}
                    style={btnSecondary}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(v.id)}
                    disabled={loading}
                    style={btnDanger}
                  >
                    {loading ? "Removendo…" : "Remover"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  value={plate}
                  onChange={e => setPlate(e.target.value)}
                  disabled={loading}
                  style={input}
                />

                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => saveEdit(v.id)}
                    disabled={loading}
                    style={btnPrimary}
                  >
                    {loading ? "Salvando…" : "Salvar"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    disabled={loading}
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

const input: React.CSSProperties = {
  width: "100%",
  padding: "6px",
  fontSize: 13,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const btnPrimary: React.CSSProperties = {
  padding: "6px 10px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12
};

const btnSecondary: React.CSSProperties = {
  padding: "6px 10px",
  background: "#e0e0e0",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12
};

const btnDanger: React.CSSProperties = {
  padding: "6px 10px",
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12
};
