import { useState } from "react";
import { CreateVehicleDTO } from "../types";

interface Props {
  onSubmit: (data: CreateVehicleDTO) => Promise<void>;
}

export function VehicleForm({ onSubmit }: Props) {
  const [plate, setPlate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ plate, description });
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

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 8,
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
        {loading ? "Salvando..." : "Cadastrar"}
      </button>
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
