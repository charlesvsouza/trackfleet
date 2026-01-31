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
// CONFIGURAÇÕES FÍSICAS
// =======================

const MIN_SPEED_KMH = 2; // abaixo disso considera parado
const MIN_DT_MS = 300;   // evita explosão de velocidade

export function MapContainer({
  vehicles,
  selectedVehicleId,
  showTrails,
  historySize,
  clearHistorySignal
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  // =======================
  // MARKERS
  // =======================

  const markersRef = useRef<
    Record<
      string,
      {
        marker: google.maps.marker.AdvancedMarkerElement;
        svg: VehicleMarkerSvg;
        info: google.maps.InfoWindow;
        lastPosition?: google.maps.LatLngLiteral;
        lastTimestamp?: number;
      }
    >
  >({});

  const historyRef = useRef<Record<string, google.maps.LatLngLiteral[]>>({});
  const polylinesRef = useRef<Record<string, google.maps.Polyline>>({});

  const [loaded, setLoaded] = useState(false);

  // =======================
  // LOAD GOOGLE MAPS
  // =======================

  useEffect(() => {
    loadGoogleMaps().then(() => setLoaded(true));
  }, []);

  // =======================
  // MAP INIT
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
  // HELPERS
  // =======================

  function computeHeading(
    prev?: google.maps.LatLngLiteral,
    curr?: google.maps.LatLngLiteral
  ) {
    if (!prev || !curr) return 0;
    return google.maps.geometry.spherical.computeHeading(prev, curr);
  }

  function computeSpeedKmH(
    prev?: google.maps.LatLngLiteral,
    curr?: google.maps.LatLngLiteral,
    dtMs?: number
  ): number {
    if (!prev || !curr || !dtMs || dtMs < MIN_DT_MS) return 0;

    const distance =
      google.maps.geometry.spherical.computeDistanceBetween(prev, curr); // metros

    const speedMps = distance / (dtMs / 1000);
    return speedMps * 3.6;
  }

  // =======================
  // UPDATE MAP
  // =======================

  useEffect(() => {
    if (!mapInstance.current) return;

    vehicles.forEach(vehicle => {
      if (!vehicle.position) return;

      const pos: google.maps.LatLngLiteral = {
        lat: vehicle.position.lat,
        lng: vehicle.position.lng
      };

      const now = vehicle.position.timestamp
        ? new Date(vehicle.position.timestamp).getTime()
        : Date.now();

      // ---------- Histórico ----------
      if (!historyRef.current[vehicle.id]) {
        historyRef.current[vehicle.id] = [];
      }

      const history = historyRef.current[vehicle.id];
      const prev = history[history.length - 1];

      history.push(pos);
      while (history.length > historySize) history.shift();

      const heading = computeHeading(prev, pos);

      // ---------- Marker ----------
      let entry = markersRef.current[vehicle.id];

      let speed = 0;
      let status = "Parado";

      if (entry?.lastPosition && entry.lastTimestamp) {
        speed = computeSpeedKmH(
          entry.lastPosition,
          pos,
          now - entry.lastTimestamp
        );

        status = speed >= MIN_SPEED_KMH ? "Em movimento" : "Parado";
      }

      const tooltipHtml = `
        <div style="font-size:12px; padding:6px 8px; line-height:1.4;">
          <strong>${vehicle.plate}</strong><br/>
          Velocidade: ${speed.toFixed(1)} km/h<br/>
          Status: ${status}
        </div>
      `;

      if (!entry) {
        const svg = createVehicleSvg();

        const info = new google.maps.InfoWindow({
          content: tooltipHtml,
          disableAutoPan: true
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current!,
          position: pos,
          content: svg.root,
          title: vehicle.plate
        });

        marker.addListener("mouseenter", () => {
          info.open({
            anchor: marker,
            map: mapInstance.current!
          });
        });

        marker.addListener("mouseleave", () => {
          info.close();
        });

        svg.setRotation(heading);

        markersRef.current[vehicle.id] = {
          marker,
          svg,
          info,
          lastPosition: pos,
          lastTimestamp: now
        };
      } else {
        entry.marker.position = pos;
        entry.svg.setRotation(heading);
        entry.info.setContent(tooltipHtml);
        entry.lastPosition = pos;
        entry.lastTimestamp = now;
      }

      // ---------- Polyline ----------
      let polyline = polylinesRef.current[vehicle.id];

      if (!polyline) {
        polyline = new google.maps.Polyline({
          map: mapInstance.current!,
          path: history,
          strokeColor: "#7b1fa2",
          strokeOpacity: 0.6,
          strokeWeight: 4
        });

        polylinesRef.current[vehicle.id] = polyline;
      } else {
        polyline.setPath(history);
      }

      polyline.setMap(showTrails ? mapInstance.current! : null);
    });
  }, [vehicles, showTrails, historySize]);

  // =======================
  // CLEAR HISTORY
  // =======================

  useEffect(() => {
    Object.values(historyRef.current).forEach(h => (h.length = 0));
    Object.values(polylinesRef.current).forEach(p => p.setPath([]));
  }, [clearHistorySignal]);

  // =======================
  // FOCUS VEHICLE
  // =======================

  useEffect(() => {
    if (!selectedVehicleId || !mapInstance.current) return;

    const entry = markersRef.current[selectedVehicleId];
    if (entry?.marker.position) {
      mapInstance.current.panTo(entry.marker.position);
      mapInstance.current.setZoom(15);
    }
  }, [selectedVehicleId]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
