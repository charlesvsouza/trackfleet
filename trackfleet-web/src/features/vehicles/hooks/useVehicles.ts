import { useEffect, useRef, useState } from "react";
import { vehicleService } from "@/services/vehicleService";
import { vehiclePositionService } from "@/services/vehiclePositionService";
import { Vehicle, CreateVehicleDTO } from "../types";

// 🔧 CONTROLE TÉCNICO
const ENABLE_POLLING = true;
const POLLING_INTERVAL_MS = 5000;

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔒 ref estável para evitar recriação do intervalo
  const vehiclesRef = useRef<Vehicle[]>([]);
  const pollingRef = useRef<number | null>(null);

  // mantém ref sincronizada com o estado
  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

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
      // polling não deve quebrar a UI
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

  // 🔁 polling isolado e estável
  useEffect(() => {
    if (!ENABLE_POLLING) return;

    pollingRef.current = window.setInterval(() => {
      pollPositions();
    }, POLLING_INTERVAL_MS);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []); // ✅ SEM dependência de vehicles

  return {
    vehicles,
    loading,
    error,
    loadVehicles,
    addVehicle
  };
}
