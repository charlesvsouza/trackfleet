import { useState } from "react";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { VehicleForm } from "@/features/vehicles/components/VehicleForm";
import { VehicleList } from "@/features/vehicles/components/VehicleList";

export function AdminVehiclesPage() {
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

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 900,
        margin: "0 auto"
      }}
    >
      {/* =======================
          HEADER
      ======================= */}
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 4 }}>Gestão de Veículos</h1>
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          Cadastro, edição e remoção de veículos do sistema
        </p>
      </header>

      {/* =======================
          ERROR
      ======================= */}
      {error && (
        <div
          style={{
            background: "#fdecea",
            color: "#b71c1c",
            padding: "8px 12px",
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 13
          }}
        >
          {error}
        </div>
      )}

      {/* =======================
          CREATE
      ======================= */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 8 }}>Novo veículo</h3>
        <VehicleForm onSubmit={addVehicle} />
      </section>

      {/* =======================
          LIST
      ======================= */}
      <section>
        <h3 style={{ marginBottom: 8 }}>Veículos cadastrados</h3>

        {loading ? (
          <p style={{ fontSize: 13, color: "#666" }}>
            Carregando veículos…
          </p>
        ) : (
          <VehicleList
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelect={setSelectedVehicleId}
            onUpdate={updateVehicle}
            onDelete={deleteVehicle}
          />
        )}
      </section>
    </div>
  );
}
