import { Marker } from "react-leaflet";
import L from "leaflet";
import { Vehicle } from "@/features/vehicles/types";

interface Props {
  vehicle: Vehicle;
  selected: boolean;
  onClick?: () => void;
}

export function VehicleMarker({ vehicle, selected, onClick }: Props) {
  if (!vehicle.position) return null;

  const { lat, lng, heading, speed } = vehicle.position;

  const isMoving = (speed ?? 0) > 3;

  const icon = L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        transform: rotate(${heading ?? 0}deg);
        transition: transform 0.2s linear;
      ">
        ${isMoving ? arrowSvg(selected) : circleSvg(selected)}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    />
  );
}

// =======================
// SVGs
// =======================

function arrowSvg(selected: boolean) {
  return `
    <svg viewBox="0 0 24 24" width="28" height="28">
      ${selected ? haloSvg() : ""}
      <path
        d="M12 2 L19 20 L12 16 L5 20 Z"
        fill="#1976d2"
      />
    </svg>
  `;
}

function circleSvg(selected: boolean) {
  return `
    <svg viewBox="0 0 24 24" width="28" height="28">
      ${selected ? haloSvg() : ""}
      <circle cx="12" cy="12" r="6" fill="#fbc02d" />
    </svg>
  `;
}

function haloSvg() {
  return `
    <circle cx="12" cy="12" r="10" fill="rgba(25,118,210,0.25)" />
  `;
}
