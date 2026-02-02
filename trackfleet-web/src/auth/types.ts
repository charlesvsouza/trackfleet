export type User = {
  id: string;
  email: string;
  role: "Admin" | "Driver";
};

export type LoginResponse = {
  token: string;
  expiresAtUtc: string;
  user: User;
};
