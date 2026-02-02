// src/api/auth.api.ts
import api from "./http";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
  user: {
    id: string;
    email: string;
    role: "Admin" | "Driver" | "User";
  };
}

export async function loginApi(
  request: LoginRequest
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/api/auth/login",
    request
  );

  return data;
}
