import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "./googleMapsLoader";
import { Vehicle } from "@/features/vehicles/types";
import { createVehicleSvg, VehicleMarkerSvg } from "./markerSvg";

interface Props {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  showTrails: boolean;
  historySize: number;
  clearHistorySignal: number;
}

// =======================
// PARÂMETROS FÍSICOS
// =======================
const MAX_SPEED_KMH = 180;          // limite plausível
const SMOOTHING_FACTOR = 0.15;      // inércia (0.1–0.25 ideal)
const STOP_THRESHOLD_KMH = 2;       // abaixo disso considera parado

export function MapContainer({
  vehicles,
  selectedVehicleId,
  showTrails,
  historySize,
  clearHistorySignal
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  const markersRef = useRef<
    Record<
      string,
      {
        marker: google.maps.marker.AdvancedMarkerElement;
        svg: VehicleMarkerSvg;
        position: google.maps.LatLngLiteral;
        velocity: google.maps.LatLngLiteral;
        speedKmh: number;
        lastUpdate: number;
      }
    >
  >({});

  const historyRef = useRef<Record<string, google.maps.LatLngLiteral[]>>({});
  const polylinesRef = useRef<Record<string, google.maps.Polyline>>({});

  const [loaded, setLoaded] = useState(false);

  // =======================
  // LOAD MAPS
  // =======================
  useEffect(() => {
    loadGoogleMaps().then(() => setLoaded(true));
  }, []);

  // =======================
  // INIT MAP
  // =======================
  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstance.current) return;

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: -22.9068, lng: -43.1729 },
      zoom: 12,
      mapId: "TRACKFLEET_MAP"
    });
  }, [loaded]);

  // =======================
  // ANIMAÇÃO COM INÉRCIA
  // =======================
  useEffect(() => {
    if (!mapInstance.current) return;

    const tick = () => {
      Object.values(markersRef.current).forEach(entry => {
        // aplica desaceleração
        entry.velocity.lat *= 1 - SMOOTHING_FACTOR;
        entry.velocity.lng *= 1 - SMOOTHING_FACTOR;

        entry.position = {
          lat: entry.position.lat + entry.velocity.lat,
          lng: entry.position.lng + entry.velocity.lng
        };

        entry.marker.position = entry.position;

        const speed =
          Math.sqrt(
            entry.velocity.lat ** 2 + entry.velocity.lng ** 2
          ) * 111_000 * 3.6;

        entry.speedKmh = speed < STOP_THRESHOLD_KMH ? 0 : speed;

        const heading = google.maps.geometry.spherical.computeHeading(
          entry.marker.position!,
          entry.position
        );

        entry.svg.setRotation(heading);
      });

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, []);

  // =======================
  // ATUALIZAÇÃO DE DADOS
  // =======================
  useEffect(() => {
    if (!mapInstance.current) return;

    const now = performance.now();

    vehicles.forEach(vehicle => {
      if (!vehicle.position) return;

      const target = {
        lat: vehicle.position.lat,
        lng: vehicle.position.lng
      };

      if (!historyRef.current[vehicle.id]) {
        historyRef.current[vehicle.id] = [];
      }

      historyRef.current[vehicle.id].push(target);
      while (historyRef.current[vehicle.id].length > historySize) {
        historyRef.current[vehicle.id].shift();
      }

      let entry = markersRef.current[vehicle.id];

      if (!entry) {
        const svg = createVehicleSvg();

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current!,
          position: target,
          content: svg.root
        });

        entry = {
          marker,
          svg,
          position: target,
          velocity: { lat: 0, lng: 0 },
          speedKmh: 0,
          lastUpdate: now
        };

        markersRef.current[vehicle.id] = entry;
      }

      const dt = Math.max((now - entry.lastUpdate) / 1000, 0.001);

      const deltaLat = target.lat - entry.position.lat;
      const deltaLng = target.lng - entry.position.lng;

      entry.velocity.lat = deltaLat / dt * 0.00001;
      entry.velocity.lng = deltaLng / dt * 0.00001;

      entry.lastUpdate = now;

      // Polyline
      let polyline = polylinesRef.current[vehicle.id];

      if (!polyline) {
        polyline = new google.maps.Polyline({
          map: mapInstance.current!,
          path: historyRef.current[vehicle.id],
          strokeColor: "#7b1fa2",
          strokeOpacity: 0.6,
          strokeWeight: 4
        });
        polylinesRef.current[vehicle.id] = polyline;
      } else {
        polyline.setPath(historyRef.current[vehicle.id]);
      }

      polyline.setMap(showTrails ? mapInstance.current! : null);
    });
  }, [vehicles, showTrails, historySize]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
