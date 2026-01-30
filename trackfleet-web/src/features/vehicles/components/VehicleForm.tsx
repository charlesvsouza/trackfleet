import { useEffect, useState } from "react";
import { CreateVehicleDTO, Vehicle } from "../types";

interface Props {
  onSubmit: (data: CreateVehicleDTO) => Promise<void>;
  onUpdate?: (id: string, data: CreateVehicleDTO) => Promise<void>;
  editingVehicle?: Vehicle | null;
  onCancelEdit?: () => void;
}

export function VehicleForm({
  onSubmit,
  onUpdate,
  editingVehicle,
  onCancelEdit
}: Props) {
  const [plate, setPlate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(editingVehicle);

  useEffect(() => {
    if (editingVehicle) {
      setPlate(editingVehicle.plate);
      setDescription(editingVehicle.description ?? "");
    } else {
      setPlate("");
      setDescription("");
    }
  }, [editingVehicle]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (isEditing && editingVehicle && onUpdate) {
      await onUpdate(editingVehicle.id, { plate, description });
    } else {
      await onSubmit({ plate, description });
    }

    setLoading(false);
    setPlate("");
    setDescription("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}
    >
      <label style={{ fontSize: 13, fontWeight: 500 }}>
        Placa
        <input
          value={plate}
          onChange={e => setPlate(e.target.value)}
          required
          placeholder="ABC-1234"
          style={inputStyle}
        />
      </label>

      <label style={{ fontSize: 13, fontWeight: 500 }}>
        Descrição
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Caminhão Volvo"
          style={inputStyle}
        />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 500,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading
            ? "Salvando..."
            : isEditing
            ? "Atualizar"
            : "Cadastrar"}
        </button>

        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={{
              padding: "10px",
              background: "#e0e0e0",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: 4,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14
};
