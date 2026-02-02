import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;
let started = false;

const SIGNALR_URL = `${import.meta.env.VITE_API_BASE_URL!.replace(
  "/api",
  ""
)}/tracking`;

interface Options {
  enabled?: boolean;
  onPosition?: (event: {
    vehicleId: string;
    lat: number;
    lng: number;
    timestamp: string;
  }) => void;
}

export function useVehicleTracking({ enabled = true, onPosition }: Options) {
  useEffect(() => {
    if (!enabled) return;

    if (started) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.on("vehiclePositionUpdated", payload => {
      onPosition?.(payload);
    });

    connection
      .start()
      .then(() => {
        started = true;
        if (process.env.NODE_ENV === "development") {
          console.log("🟢 SignalR conectado (singleton)");
        }
      })
      .catch(err => {
        console.error("🔴 Erro SignalR:", err);
      });

    return () => {
      // ❗ NÃO fechar a conexão aqui
      // React pode desmontar o componente sem intenção real
    };
  }, [enabled, onPosition]);
}
