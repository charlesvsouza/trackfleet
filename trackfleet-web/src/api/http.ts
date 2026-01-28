import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5249/api";

export const http = axios.create({
  baseURL,
});

// Interceptor para adicionar token em todas as requisições
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
