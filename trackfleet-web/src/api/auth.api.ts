import { http } from "./http";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
}

export async function loginApi(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>(
    "/auth/login",
    data
  );
  return response.data;
}
