import {
  getUsers,
  createUser,
  updateUserRole,
  toggleUserStatus,
  UserDto
} from "@/api/users.api";

export const userService = {
  list(): Promise<UserDto[]> {
    return getUsers();
  },

  create(payload: {
    email: string;
    fullName: string;
    role: string;
    password?: string;
  }): Promise<UserDto> {
    return createUser(payload);
  },

  updateRole(id: string, role: string): Promise<void> {
    return updateUserRole(id, role);
  },

  toggleStatus(id: string): Promise<void> {
    return toggleUserStatus(id);
  }
};
