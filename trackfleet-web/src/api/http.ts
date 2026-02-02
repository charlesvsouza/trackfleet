// src/api/http.ts
import axios from "axios";

// URL base da API
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5249";

const api = axios.create({
  baseURL,
  // Opcional: headers padrão
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// INTERCEPTOR JWT
// =======================
api.interceptors.request.use(
  (config) => {
    // CORREÇÃO: Usando a MESMA chave que o AuthContext usa ("access_token")
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (Opcional) Interceptor de Resposta para tratar token expirado automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirou ou inválido -> Limpa e força logout
      // Cuidado para não criar loop infinito de redirects
      console.warn("Sessão expirada ou inválida (401)");
      // localStorage.removeItem("access_token");
      // window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;