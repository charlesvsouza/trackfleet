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

const ANIMATION_DURATION = 800; // ms
const SPEED_EPSILON = 0.5; // m/s (~1.8 km/h)

export function MapContainer({
  vehicles,
  selectedVehicleId,
  showTrails,
  historySize,
  clearHistorySignal
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const markersRef = useRef<
    Record<
      string,
      {
        marker: google.maps.marker.AdvancedMarkerElement;
        svg: VehicleMarkerSvg;
        current: google.maps.LatLngLiteral;
        target: google.maps.LatLngLiteral;
        startTime: number;
        lastUpdate: number;
        speedKmh: number;
        plate: string;
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

    infoWindowRef.current = new google.maps.InfoWindow();
  }, [loaded]);

  // =======================
  // HELPERS
  // =======================
  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function interpolate(
    from: google.maps.LatLngLiteral,
    to: google.maps.LatLngLiteral,
    t: number
  ): google.maps.LatLngLiteral {
    return {
      lat: lerp(from.lat, to.lat, t),
      lng: lerp(from.lng, to.lng, t)
    };
  }

  function computeSpeedKmh(
    from: google.maps.LatLngLiteral,
    to: google.maps.LatLngLiteral,
    deltaMs: number
  ) {
    const meters =
      google.maps.geometry.spherical.computeDistanceBetween(from, to);
    const seconds = deltaMs / 1000;
    if (seconds <= 0) return 0;
    return (meters / seconds) * 3.6;
  }

  // =======================
  // ANIMATION LOOP
  // =======================
  function animate() {
    const now = performance.now();

    Object.values(markersRef.current).forEach(entry => {
      const elapsed = now - entry.startTime;
      const t = Math.min(elapsed / ANIMATION_DURATION, 1);

      const pos = interpolate(entry.current, entry.target, t);
      entry.marker.position = pos;

      const heading = google.maps.geometry.spherical.computeHeading(
        entry.current,
        entry.target
      );
      entry.svg.setRotation(heading);

      if (t === 1) {
        entry.current = entry.target;
      }
    });

    requestAnimationFrame(animate);
  }

  useEffect(() => {
    if (!loaded) return;
    requestAnimationFrame(animate);
  }, [loaded]);

  // =======================
  // DATA UPDATE
  // =======================
  useEffect(() => {
    if (!mapInstance.current) return;

    vehicles.forEach(vehicle => {
      if (!vehicle.position) return;

      const pos: google.maps.LatLngLiteral = {
        lat: vehicle.position.lat,
        lng: vehicle.position.lng
      };

      if (!historyRef.current[vehicle.id]) {
        historyRef.current[vehicle.id] = [];
      }

      const history = historyRef.current[vehicle.id];
      const prev = history[history.length - 1];

      history.push(pos);
      while (history.length > historySize) history.shift();

      const now = performance.now();

      const entry = markersRef.current[vehicle.id];

      if (!entry) {
        const svg = createVehicleSvg();

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current!,
          position: pos,
          content: svg.root
        });

        const newEntry = {
          marker,
          svg,
          current: pos,
          target: pos,
          startTime: now,
          lastUpdate: now,
          speedKmh: 0,
          plate: vehicle.plate
        };

        marker.addListener("mouseover", () => {
          if (!infoWindowRef.current) return;

          const status =
            newEntry.speedKmh < SPEED_EPSILON
              ? "Parado"
              : "Em movimento";

          infoWindowRef.current.setContent(`
            <div style="font-size:13px">
              <strong>Placa:</strong> ${newEntry.plate}<br/>
              <strong>Velocidade:</strong> ${newEntry.speedKmh.toFixed(
                1
              )} km/h<br/>
              <strong>Status:</strong> ${status}
            </div>
          `);

          infoWindowRef.current.open({
            map: mapInstance.current!,
            anchor: marker
          });
        });

        marker.addListener("mouseout", () => {
          infoWindowRef.current?.close();
        });

        markersRef.current[vehicle.id] = newEntry;
      } else {
        if (prev) {
          entry.speedKmh = computeSpeedKmh(
            prev,
            pos,
            now - entry.lastUpdate
          );
        }

        entry.target = pos;
        entry.startTime = now;
        entry.lastUpdate = now;
      }

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
