// src/features/vehicles/hooks/useVehicles.ts

import { useEffect, useRef, useState } from "react";
import { vehicleService } from "@/services/vehicleService";
import { vehiclePositionService } from "@/services/vehiclePositionService";
import { Vehicle, CreateVehicleDTO } from "../types";

const POLLING_INTERVAL_MS = 5000;

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  async function loadVehicles() {
    try {
      setLoading(true);

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

  async function pollPositions() {
    try {
      const updated = await Promise.all(
        vehicles.map(async v => {
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
      // polling falhar não deve quebrar a UI
    }
  }

  async function addVehicle(payload: CreateVehicleDTO) {
    const created = await vehicleService.create(payload);
    setVehicles(prev => [...prev, created]);
    return created;
  }

  // 🔁 carga inicial
  useEffect(() => {
    loadVehicles();
  }, []);

  // 🔁 polling seguro
  useEffect(() => {
    pollingRef.current = window.setInterval(() => {
      pollPositions();
    }, POLLING_INTERVAL_MS);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [vehicles]); // ← DEPENDÊNCIA CRÍTICA

  return {
    vehicles,
    loading,
    error,
    loadVehicles,
    addVehicle
  };
}
