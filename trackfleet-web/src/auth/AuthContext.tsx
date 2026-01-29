// src/auth/AuthContext.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { loginApi } from "../api/auth.api";

interface AuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const response = await loginApi({ email, password });

    localStorage.setItem("token", response.token);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
