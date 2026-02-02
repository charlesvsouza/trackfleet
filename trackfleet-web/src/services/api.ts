import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5249",
});

const token = localStorage.getItem("access_token");

if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export default api;
