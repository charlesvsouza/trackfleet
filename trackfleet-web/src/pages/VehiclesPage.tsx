import { useState } from "react";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { VehicleSidebar } from "@/features/vehicles/components/VehicleSidebar";
import { MapContainer } from "@/map/MapContainer";

export function VehiclesPage() {
  const { vehicles, loading, error } = useVehicles();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );

  const [showTrails, setShowTrails] = useState(true);
  const [historySize] = useState(50);
  const [clearHistorySignal, setClearHistorySignal] = useState(0);

  // =======================
  // HANDLERS
  // =======================

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
        gridTemplateColumns: "320px 1fr",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      {/* =======================
          SIDEBAR (MONITORAMENTO)
      ======================= */}
      <VehicleSidebar
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onSelect={setSelectedVehicleId}
      />

      {/* =======================
          MAPA
      ======================= */}
      <main style={{ position: "relative" }}>
        {/* Loading */}
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

        {/* Error */}
        {error && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              background: "#fdecea",
              color: "#b71c1c",
              padding: "6px 10px",
              borderRadius: 6,
              fontSize: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
            }}
          >
            {error}
          </div>
        )}

        {/* Controls */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            zIndex: 10,
            background: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "flex",
            gap: 12,
            alignItems: "center",
            fontSize: 13
          }}
        >
          <label style={{ display: "flex", gap: 6 }}>
            <input
              type="checkbox"
              checked={showTrails}
              onChange={e => setShowTrails(e.target.checked)}
            />
            Exibir trilha
          </label>

          <button
            onClick={handleClearTrails}
            style={{
              border: "none",
              background: "#e0e0e0",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 12
            }}
          >
            Limpar
          </button>
        </div>

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
