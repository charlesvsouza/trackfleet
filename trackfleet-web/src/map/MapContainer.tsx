// src/map/MapContainer.tsx

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "./googleMapsLoader";
import { Vehicle } from "@/features/vehicles/types";

interface MapContainerProps {
  vehicles: Vehicle[];
}

export function MapContainer({ vehicles }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 1️⃣ Carrega Google Maps
  useEffect(() => {
    loadGoogleMaps()
      .then(() => setLoaded(true))
      .catch(console.error);
  }, []);

  // 2️⃣ Cria o mapa uma única vez
  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstance.current) return;

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: -22.9068, lng: -43.1729 }, // Brasil (fallback seguro)
      zoom: 11
    });
  }, [loaded]);

  // 3️⃣ Atualiza markers
  useEffect(() => {
    if (!loaded || !mapInstance.current) return;

    // Remove markers antigos
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    let hasValidPosition = false;

    vehicles.forEach(vehicle => {
      if (!vehicle.position) return;

      const position = {
        lat: vehicle.position.lat,
        lng: vehicle.position.lng
      };

      hasValidPosition = true;
      bounds.extend(position);

      const marker = new google.maps.Marker({
        position,
        map: mapInstance.current!,
        title: vehicle.name
      });

      markersRef.current.push(marker);
    });

    // ✅ SÓ ajusta o zoom se existir pelo menos 1 posição válida
    if (hasValidPosition) {
      mapInstance.current.fitBounds(bounds);
    }
  }, [vehicles, loaded]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
