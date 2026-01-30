// src/pages/MapPage.tsx

import { useState } from "react";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { VehicleForm } from "@/features/vehicles/components/VehicleForm";
import { VehicleList } from "@/features/vehicles/components/VehicleList";
import { MapContainer } from "@/map/MapContainer";

export function MapPage() {
  const { vehicles, loading, error, addVehicle } = useVehicles();

  const [showForm, setShowForm] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // 🔧 CONTROLES DE TRILHA
  const [showTrails, setShowTrails] = useState(true);
  const [historySize, setHistorySize] = useState(30);
  const [clearHistorySignal, setClearHistorySignal] = useState(0);

  if (loading) return <p style={{ padding: 24 }}>Carregando veículos…</p>;
  if (error) return <p style={{ padding: 24, color: "#b00020" }}>{error}</p>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f4f6f8" }}>
      {/* SIDEBAR */}
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
          <p style={{ marginTop: 4, color: "#666" }}>
            Monitoramento de veículos
          </p>
        </header>

        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            padding: "10px 14px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          {showForm ? "Fechar cadastro" : "+ Cadastrar veículo"}
        </button>

        {showForm && (
          <VehicleForm
            onSubmit={async data => {
              await addVehicle(data);
              setShowForm(false);
            }}
          />
        )}

        {/* 🔧 CONTROLES DE TRILHA */}
        <section
          style={{
            padding: 12,
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            background: "#fafafa"
          }}
        >
          <strong>Trilha</strong>

          <label style={{ display: "block", marginTop: 8 }}>
            <input
              type="checkbox"
              checked={showTrails}
              onChange={e => setShowTrails(e.target.checked)}
            />{" "}
            Exibir trilhas
          </label>

          <label style={{ display: "block", marginTop: 8 }}>
            Histórico ({historySize})
            <input
              type="range"
              min={5}
              max={100}
              value={historySize}
              onChange={e => setHistorySize(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </label>

          <button
            onClick={() => setClearHistorySignal(v => v + 1)}
            style={{
              marginTop: 8,
              padding: "6px 10px",
              borderRadius: 4,
              border: "1px solid #d32f2f",
              background: "#fff",
              color: "#d32f2f",
              cursor: "pointer"
            }}
          >
            Limpar trilhas
          </button>
        </section>

        <section style={{ flex: 1, overflowY: "auto" }}>
          <VehicleList
            vehicles={vehicles}
            onSelect={setSelectedVehicleId}
            selectedVehicleId={selectedVehicleId}
          />
        </section>
      </aside>

      {/* MAPA */}
      <main style={{ flex: 1 }}>
        <MapContainer
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          showTrails={showTrails}
          historySize={historySize}
          clearHistorySignal={clearHistorySignal}
        />
      </main>
    </div>
  );
}
