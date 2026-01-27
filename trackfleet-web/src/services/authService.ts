import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  expiresAtUtc: string;
};

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/api/auth/login",
    request
  );

  return response.data;
}
