import api from "./http";

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

export async function getUsers(): Promise<UserDto[]> {
  const { data } = await api.get("/users");
  return data;
}

export async function createUser(payload: {
  email: string;
  fullName: string;
  role: string;
  password?: string;
}): Promise<UserDto> {
  const { data } = await api.post("/users", payload);
  return data;
}

export async function updateUserRole(
  id: string,
  role: string
): Promise<void> {
  await api.put(`/users/${id}/role`, { role });
}

export async function toggleUserStatus(id: string): Promise<void> {
  await api.put(`/users/${id}/status`);
}
