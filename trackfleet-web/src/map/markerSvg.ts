export interface VehicleMarkerSvg {
  root: SVGSVGElement;
  // Adicionei a função update que faltava
  update: (params: { heading: number; moving: boolean; selected: boolean }) => void;
}

export function createVehicleSvg(): VehicleMarkerSvg {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "40");
  svg.setAttribute("height", "40");
  svg.setAttribute("viewBox", "0 0 40 40");

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", "translate(20 20) rotate(0) translate(-20 -20)");

  // Círculo de fundo (muda de cor se selecionado/andando)
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "20");
  circle.setAttribute("cy", "20");
  circle.setAttribute("r", "18");
  circle.setAttribute("fill", "#ffffff");
  circle.setAttribute("stroke", "#333");
  circle.setAttribute("stroke-width", "2");

  // Seta de direção
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrow.setAttribute("d", "M20 5 L35 35 L20 28 L5 35 Z"); // Formato de seta
  arrow.setAttribute("fill", "#1976d2");

  g.appendChild(circle);
  g.appendChild(arrow);
  svg.appendChild(g);

  // --- Função UPDATE que faltava ---
  function update({ heading, moving, selected }: { heading: number; moving: boolean; selected: boolean }) {
    // 1. Rotação
    g.setAttribute("transform", `translate(20 20) rotate(${heading}) translate(-20 -20)`);

    // 2. Cor baseada no status
    if (selected) {
        circle.setAttribute("stroke", "#ff9800"); // Laranja se selecionado
        circle.setAttribute("stroke-width", "4");
    } else {
        circle.setAttribute("stroke", "#333");
        circle.setAttribute("stroke-width", "2");
    }

    if (moving) {
        arrow.setAttribute("fill", "#2e7d32"); // Verde se andando
    } else {
        arrow.setAttribute("fill", "#d32f2f"); // Vermelho se parado
    }
  }

  return {
    root: svg,
    update // Retorna a função
  };
}