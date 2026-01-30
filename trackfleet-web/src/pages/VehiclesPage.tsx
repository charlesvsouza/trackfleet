import { useState } from "react";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { VehicleForm } from "@/features/vehicles/components/VehicleForm";
import { VehicleList } from "@/features/vehicles/components/VehicleList";
import { MapContainer } from "@/map/MapContainer";

export function VehiclesPage() {
  const {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle
  } = useVehicles();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );

  const [showTrails, setShowTrails] = useState(true);
  const [historySize, setHistorySize] = useState(50);
  const [clearHistorySignal, setClearHistorySignal] = useState(0);

  // =======================
  // HANDLERS
  // =======================

  function handleSelectVehicle(id: string) {
    setSelectedVehicleId(id);
  }

  function handleClearTrails() {
    setClearHistorySignal(prev => prev + 1);
  }

  // =======================
  // UI
  // =======================

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      {/* =======================
          SIDEBAR
      ======================= */}
      <aside
        style={{
          padding: 16,
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto"
        }}
      >
        <h2 style={{ margin: 0 }}>Veículos</h2>

        {error && (
          <div style={{ color: "red", fontSize: 13 }}>{error}</div>
        )}

        <VehicleForm onSubmit={addVehicle} />

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center"
          }}
        >
          <label style={{ fontSize: 13 }}>
            <input
              type="checkbox"
              checked={showTrails}
              onChange={e => setShowTrails(e.target.checked)}
            />{" "}
            Exibir trilhas
          </label>

          <button
            onClick={handleClearTrails}
            style={{
              marginLeft: "auto",
              padding: "4px 8px",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            Limpar
          </button>
        </div>

        <VehicleList
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelect={handleSelectVehicle}
        />
      </aside>

      {/* =======================
          MAPA
      ======================= */}
      <main style={{ position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 10,
              background: "#fff",
              padding: "6px 10px",
              borderRadius: 6,
              fontSize: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
            }}
          >
            Carregando veículos…
          </div>
        )}

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
