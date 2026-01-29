import { useEffect, useState } from "react";
import * as VehiclesApi from "../api/vehicles.api";

export default function MapPage() {
  const [vehicles, setVehicles] = useState<VehiclesApi.VehicleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicles() {
      try {
        console.log("Buscando veículos...");
        const data = await VehiclesApi.getVehicles();
        console.log("Veículos recebidos:", data);
        setVehicles(data);
      } catch (err) {
        console.error("Erro ao carregar veículos", err);
        setError("Erro ao carregar veículos");
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando veículos...</p>;
  }

  if (error) {
    return (
      <p style={{ padding: 20, color: "red" }}>
        {error}
      </p>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Veículos</h2>

      {vehicles.length === 0 && (
        <p>Nenhum veículo cadastrado.</p>
      )}

      <ul>
        {vehicles.map((v) => (
          <li key={v.id}>
            <strong>{v.plate}</strong>
            {v.description && ` — ${v.description}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
