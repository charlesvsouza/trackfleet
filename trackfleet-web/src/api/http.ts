import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5249/api";

export const http = axios.create({
  baseURL,
});

// Interceptor para adicionar token (exceto rotas públicas)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isPublicEndpoint =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/refresh");

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para tratar erros de autenticação
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("AXIOS ERROR:", error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

