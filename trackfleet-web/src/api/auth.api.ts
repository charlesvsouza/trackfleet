import { http } from "./http";

export interface LoginRequest {
  email: string;
  password: string;
}

// src/api/auth.api.ts

import api from "./http";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function loginApi(
  request: LoginRequest
): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", request);
  return data;
}
