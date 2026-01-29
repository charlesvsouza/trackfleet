// src/api/http.ts

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// 🔐 Interceptor de REQUEST: injeta o token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 Interceptor de RESPONSE: trata token expirado (401)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Remove token inválido
      localStorage.removeItem("token");

      // Evita loop se já estiver no login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
