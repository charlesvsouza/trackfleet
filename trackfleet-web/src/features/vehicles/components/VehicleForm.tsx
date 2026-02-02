import { useState } from "react";
import { CreateVehicleDTO } from "../types";

interface Props {
  onSubmit: (data: CreateVehicleDTO) => Promise<void>;
}

export function VehicleForm({ onSubmit }: Props) {
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!plate.trim()) {
      setError("Informe a placa do veículo.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await onSubmit({ plate });

      setPlate("");
      setSuccess(true);
    } catch {
      setError("Erro ao cadastrar veículo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 8 }}>
        <input
          value={plate}
          onChange={e => setPlate(e.target.value)}
          placeholder="Placa do veículo"
          disabled={loading}
          style={input}
        />
      </div>

      {error && <div style={errorStyle}>{error}</div>}
      {success && (
        <div style={successStyle}>Veículo cadastrado com sucesso.</div>
      )}

      <button type="submit" disabled={loading} style={button}>
        {loading ? "Salvando…" : "Adicionar veículo"}
      </button>
    </form>
  );
}

// =======================
// STYLES
// =======================

const input: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  fontSize: 14,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const button: React.CSSProperties = {
  marginTop: 8,
  padding: "8px 12px",
  borderRadius: 6,
  border: "none",
  background: "#1976d2",
  color: "#fff",
  cursor: "pointer",
  fontSize: 13
};

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#b71c1c",
  marginBottom: 6
};

const successStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#2e7d32",
  marginBottom: 6
};
