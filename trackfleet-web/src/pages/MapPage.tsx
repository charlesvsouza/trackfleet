// src/pages/MapPage.tsx

import { useState } from "react";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { VehicleForm } from "@/features/vehicles/components/VehicleForm";
import { VehicleList } from "@/features/vehicles/components/VehicleList";
import { MapContainer } from "@/map/MapContainer";

export function MapPage() {
  const { vehicles, loading, error, addVehicle } = useVehicles();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return <p style={{ padding: 24 }}>Carregando veículos...</p>;
  }

  if (error) {
    return (
      <p style={{ padding: 24, color: "#b00020" }}>
        {error}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f4f6f8" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 360,
          background: "#ffffff",
          borderRight: "1px solid #e0e0e0",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        <header>
          <h1 style={{ margin: 0, fontSize: 22 }}>TrackFleet</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
            Monitoramento de veículos
          </p>
        </header>

        <button
          onClick={() => setShowForm(prev => !prev)}
          style={{
            padding: "10px 14px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          {showForm ? "Fechar cadastro" : "+ Cadastrar veículo"}
        </button>

        {showForm && (
          <div
            style={{
              background: "#fafafa",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: 16
            }}
          >
            <VehicleForm
              onSubmit={async data => {
                await addVehicle(data);
                setShowForm(false);
              }}
            />
          </div>
        )}

        <section style={{ flex: 1, overflowY: "auto" }}>
          <VehicleList vehicles={vehicles} />
        </section>
      </aside>

      {/* Mapa */}
      <main style={{ flex: 1 }}>
        <MapContainer vehicles={vehicles} />
      </main>
    </div>
  );
}
