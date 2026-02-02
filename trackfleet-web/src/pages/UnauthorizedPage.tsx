import React from "react";

export function UnauthorizedPage() { // MUDANÇA: 'export function'
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2 style={{ color: "#d9534f" }}>Acesso negado 🚫</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <a href="/login" style={{ color: "#0275d8", textDecoration: "underline" }}>Voltar para o Login</a>
    </div>
  );
}