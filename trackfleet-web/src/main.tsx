import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Ajuste o caminho para onde salvamos o arquivo no passo anterior
import { AuthProvider } from "./contexts/AuthContext"; 
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* O AuthProvider deve ficar aqui, envolvendo toda a aplicação UMA VEZ */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);