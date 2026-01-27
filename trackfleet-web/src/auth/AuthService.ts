import { loginApi } from "../api/auth.api";

export async function login(email: string, password: string) {
  const result = await loginApi({ email, password });
  localStorage.setItem("token", result.token);
  return result;
}
