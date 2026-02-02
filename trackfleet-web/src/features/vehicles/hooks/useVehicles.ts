import { useEffect, useRef, useState } from "react";
import { vehicleService } from "@/services/vehicleService";
import { vehiclePositionService } from "@/services/vehiclePositionService";
import { Vehicle, CreateVehicleDTO } from "../types";
import { useVehicleTracking } from "@/realtime/useVehicleTracking";

// =======================
// CONTROLE TÉCNICO
// =======================

const ENABLE_POLLING = true;
const POLLING_INTERVAL_MS = 5000;
const ENABLE_SIGNALR = true;

// =======================
// HOOK
// =======================

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vehiclesRef = useRef<Vehicle[]>([]);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  // =======================
  // LOAD INICIAL
  // =======================

  async function loadVehicles() {
    try {
      setLoading(true);
      setError(null);

      const vehiclesData = await vehicleService.list();

      const vehiclesWithPosition = await Promise.all(
        vehiclesData.map(async v => {
          try {
            const position = await vehiclePositionService.getCurrent(v.id);
            return { ...v, position };
          } catch {
            return v;
          }
        })
      );

      setVehicles(vehiclesWithPosition);
    } catch {
      setError("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }

  // =======================
  // POLLING
  // =======================

  async function pollPositions() {
    try {
      const current = vehiclesRef.current;
      if (current.length === 0) return;

      const updated = await Promise.all(
        current.map(async v => {
          try {
            const position = await vehiclePositionService.getCurrent(v.id);
            return { ...v, position };
          } catch {
            return v;
          }
        })
      );

      setVehicles(updated);
    } catch {
      // silencioso
    }
  }

  // =======================
  // CREATE
  // =======================

  async function addVehicle(payload: CreateVehicleDTO) {
    try {
      setLoading(true);
      setError(null);

      const created = await vehicleService.create(payload);
      setVehicles(prev => [...prev, created]);

      return created;
    } catch {
      setError("Erro ao criar veículo");
      throw new Error("create_failed");
    } finally {
      setLoading(false);
    }
  }

  // =======================
  // UPDATE
  // =======================

  async function updateVehicle(id: string, payload: CreateVehicleDTO) {
    try {
      setLoading(true);
      setError(null);

      const updated = await vehicleService.update(id, payload);

      setVehicles(prev =>
        prev.map(v => (v.id === id ? { ...v, ...updated } : v))
      );

      return updated;
    } catch {
      setError("Erro ao atualizar veículo");
      throw new Error("update_failed");
    } finally {
      setLoading(false);
    }
  }

  // =======================
  // DELETE
  // =======================

  async function deleteVehicle(id: string) {
    const snapshot = vehiclesRef.current;

    try {
      setLoading(true);
      setError(null);

      await vehicleService.remove(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch {
      setVehicles(snapshot);
      setError("Erro ao remover veículo");
      throw new Error("delete_failed");
    } finally {
      setLoading(false);
    }
  }

  // =======================
  // EFFECTS
  // =======================

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (!ENABLE_POLLING) return;

    pollingRef.current = window.setInterval(
      pollPositions,
      POLLING_INTERVAL_MS
    );

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // =======================
  // SIGNALR
  // =======================

  useVehicleTracking({
    enabled: ENABLE_SIGNALR,
    onPosition: event => {
      setVehicles(prev =>
        prev.map(v =>
          v.id === event.vehicleId
            ? {
                ...v,
                position: {
                  lat: event.lat,
                  lng: event.lng,
                  timestamp: event.timestamp
                }
              }
            : v
        )
      );
    }
  });

  // =======================
  // API
  // =======================

  return {
    vehicles,
    loading,
    error,
    loadVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
}
