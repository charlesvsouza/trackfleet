// src/features/vehicles/components/VehicleForm.tsx

import { useState } from "react";
import { CreateVehicleDTO, VehicleType } from "../types";

interface VehicleFormProps {
  onSubmit: (data: CreateVehicleDTO) => Promise<void>;
}

export function VehicleForm({ onSubmit }: VehicleFormProps) {
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");
  const [type, setType] = useState<VehicleType>("Car");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ name, plate, type });
    setName("");
    setPlate("");
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
      <h3 style={{ margin: 0, fontSize: 16 }}>Novo veículo</h3>

      <label style={{ fontSize: 13, color: "#555" }}>
        Nome
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={inputStyle}
        />
      </label>

      <label style={{ fontSize: 13, color: "#555" }}>
        Placa
        <input
          value={plate}
          onChange={e => setPlate(e.target.value)}
          required
          style={inputStyle}
        />
      </label>

      <label style={{ fontSize: 13, color: "#555" }}>
        Tipo
        <select
          value={type}
          onChange={e => setType(e.target.value as VehicleType)}
          style={inputStyle}
        >
          <option value="Car">Carro</option>
          <option value="Truck">Caminhão</option>
          <option value="Motorcycle">Moto</option>
        </select>
      </label>

      <button
        type="submit"
        style={{
          marginTop: 8,
          padding: "10px 14px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 500
        }}
      >
        Salvar veículo
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  marginTop: 4,
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14
};
