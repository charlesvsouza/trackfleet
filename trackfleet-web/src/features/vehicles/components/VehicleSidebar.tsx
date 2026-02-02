import { useMemo, useState } from "react";
import { Vehicle } from "../types";

// =======================
// PROPS
// =======================

interface Props {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (id: string | null) => void;
}

// =======================
// COMPONENT
// =======================

export function VehicleSidebar({
  vehicles,
  selectedVehicleId,
  onSelect
}: Props) {
  const [query, setQuery] = useState("");
  const [onlyOnline, setOnlyOnline] = useState(false);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (onlyOnline && !v.position) return false;
      if (
        query &&
        !v.plate.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [vehicles, query, onlyOnline]);

  const selectedVehicle =
    vehicles.find(v => v.id === selectedVehicleId) ?? null;

  // =======================
  // RENDER
  // =======================

  return (
    <aside style={styles.sidebar}>
      {/* =======================
          HEADER
      ======================= */}
      <div style={styles.header}>
        <h2 style={styles.title}>Veículos</h2>
        <div style={styles.subtitle}>
          {vehicles.length} veículos ·{" "}
          {vehicles.filter(v => v.position).length} online
        </div>
      </div>

      {/* =======================
          SEARCH / FILTER
      ======================= */}
      <div style={styles.controls}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar placa…"
          style={styles.input}
        />

        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={onlyOnline}
            onChange={e => setOnlyOnline(e.target.checked)}
          />
          Online
        </label>
      </div>

      {/* =======================
          CONTENT
      ======================= */}
      <div style={styles.content}>
        {!selectedVehicle ? (
          <VehicleCompactList
            vehicles={filteredVehicles}
            selectedVehicleId={selectedVehicleId}
            onSelect={onSelect}
          />
        ) : (
          <VehicleFocusPanel
            vehicle={selectedVehicle}
            onBack={() => onSelect(null)}
          />
        )}
      </div>
    </aside>
  );
}

// =======================
// INTERNAL COMPONENTS
// =======================

function VehicleCompactList({
  vehicles,
  selectedVehicleId,
  onSelect
}: {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
}) {
  if (vehicles.length === 0) {
    return (
      <p style={styles.empty}>
        Nenhum veículo encontrado
      </p>
    );
  }

  return (
    <ul style={styles.list}>
      {vehicles.map(v => {
        const selected = v.id === selectedVehicleId;
        const online = !!v.position;

        return (
          <li
            key={v.id}
            onClick={() => onSelect(v.id)}
            style={{
              ...styles.listItem,
              background: selected ? "#e3f2fd" : "transparent"
            }}
          >
            <div style={styles.plate}>{v.plate}</div>
            <div
              style={{
                ...styles.status,
                color: online ? "#2e7d32" : "#999"
              }}
            >
              {online ? "Online" : "Offline"}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function VehicleFocusPanel({
  vehicle,
  onBack
}: {
  vehicle: Vehicle;
  onBack: () => void;
}) {
  const pos = vehicle.position;

  return (
    <div style={styles.focus}>
      <button onClick={onBack} style={styles.back}>
        ← Voltar
      </button>

      <h3 style={styles.focusTitle}>{vehicle.plate}</h3>

      <div style={styles.focusStatus}>
        {pos ? "🟢 Online" : "⚪ Offline"}
      </div>

      {pos && (
        <div style={styles.focusInfo}>
          <div>
            <strong>Lat:</strong> {pos.lat.toFixed(5)}
          </div>
          <div>
            <strong>Lng:</strong> {pos.lng.toFixed(5)}
          </div>
          <div>
            <strong>Atualizado:</strong>{" "}
            {new Date(pos.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}

      <p style={styles.focusHint}>
        A trilha será exibida no mapa quando habilitada.
      </p>
    </div>
  );
}

// =======================
// STYLES
// =======================

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 320,
    height: "100%",
    borderRight: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    background: "#fff"
  },
  header: {
    padding: 16
  },
  title: {
    margin: 0
  },
  subtitle: {
    fontSize: 12,
    color: "#666"
  },
  controls: {
    padding: "0 16px 12px",
    display: "flex",
    gap: 8,
    alignItems: "center"
  },
  input: {
    flex: 1,
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 13
  },
  checkbox: {
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 4
  },
  content: {
    flex: 1,
    overflowY: "auto"
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0
  },
  listItem: {
    padding: "10px 16px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0"
  },
  plate: {
    fontSize: 14,
    fontWeight: 500
  },
  status: {
    fontSize: 12
  },
  empty: {
    padding: 16,
    fontSize: 13,
    color: "#777"
  },
  focus: {
    padding: 16
  },
  back: {
    border: "none",
    background: "none",
    color: "#1976d2",
    cursor: "pointer",
    padding: 0,
    fontSize: 13
  },
  focusTitle: {
    marginTop: 12
  },
  focusStatus: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12
  },
  focusInfo: {
    fontSize: 13,
    lineHeight: 1.6
  },
  focusHint: {
    marginTop: 16,
    fontSize: 12,
    color: "#777"
  }
};
