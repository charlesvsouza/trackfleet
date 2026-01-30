// src/map/markerSvg.ts

export interface VehicleMarkerSvg {
  root: SVGSVGElement;
  setRotation: (deg: number) => void;
}

export function createVehicleSvg(): VehicleMarkerSvg {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "36");
  svg.setAttribute("height", "36");
  svg.setAttribute("viewBox", "0 0 36 36");

  // 🔁 Grupo rotacionável (NUNCA recriado)
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute(
    "transform",
    "translate(18 18) rotate(0) translate(-18 -18)"
  );

  // Corpo do veículo
  const body = document.createElementNS("http://www.w3.org/2000/svg", "path");
  body.setAttribute(
    "d",
    "M18 2c-5 0-9 4-9 9v10c0 2 1 3 3 3h12c2 0 3-1 3-3V11c0-5-4-9-9-9z"
  );
  body.setAttribute("fill", "#1976d2");
  body.setAttribute("stroke", "#0d47a1");
  body.setAttribute("stroke-width", "1.5");

  // Direção / heading
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrow.setAttribute("d", "M18 6l4 6h-8z");
  arrow.setAttribute("fill", "#ffffff");

  g.appendChild(body);
  g.appendChild(arrow);
  svg.appendChild(g);

  // 🔧 API de mutação (ETAPA 9)
  function setRotation(deg: number) {
    g.setAttribute(
      "transform",
      `translate(18 18) rotate(${deg}) translate(-18 -18)`
    );
  }

  return {
    root: svg,
    setRotation
  };
}
