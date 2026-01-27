import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import { loginApi } from "../api/auth.api";

type AuthContextType = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  async function login(email: string, password: string) {
    const result = await loginApi({ email, password });

    localStorage.setItem("token", result.token);
    setToken(result.token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
