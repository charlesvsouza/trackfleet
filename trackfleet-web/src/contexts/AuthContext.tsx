import { createContext, useEffect, useState } from "react";
import api from "@/services/api";
import { jwtDecode } from "jwt-decode";
import type { LoginResponse, User } from "../auth/types";

// Tipagem exportada para uso no useAuth
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean; // Adicionei para facilitar os guards
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Interface flexível para o Payload do JWT
interface JwtPayload {
  sub: string;
  email: string;
  tenant_id: string;
  role?: string | string[]; // Pode ser string ou array
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  exp?: number;
}

function buildUserFromToken(token: string): User {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Tenta encontrar a role em vários lugares comuns
    let roleClaim = 
      decoded.role || 
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Se a role vier como Array (ex: ["Admin", "User"]), pega a primeira
    const userRole = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

    // Se mesmo assim não achar, fallback para 'User' para não quebrar o app
    const finalRole = userRole || "User"; 

    return {
      id: decoded.sub || "unknown-id",
      email: decoded.email || "unknown-email",
      role: finalRole,
      tenantId: decoded.tenant_id || "unknown-tenant",
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    throw new Error("Token inválido");
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const userFromToken = buildUserFromToken(token);
        
        // Verifica validade (opcional)
        const decoded = jwtDecode<JwtPayload>(token);
        const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;

        if (!isExpired) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          setUser(userFromToken);
        } else {
          console.warn("Token expirado no boot");
          logout();
        }
      } catch (err) {
        console.error("Falha ao restaurar sessão:", err);
        logout();
      }
    }

    setLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<User> {
    try {
      const response = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      // DEBUG: Veja no console o que o backend devolveu
      console.log("Resposta do Login:", response.data);

      // Tenta pegar 'token' OU 'accessToken' (compatibilidade)
      // @ts-ignore (para permitir acesso dinâmico se a tipagem for estrita)
      const token = response.data.token || response.data.accessToken;

      if (!token) {
        throw new Error("Backend não retornou um token válido!");
      }

      const userFromToken = buildUserFromToken(token);

      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(userFromToken)); // Opcional

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(userFromToken);

      return userFromToken;
    } catch (error) {
      console.error("Erro no Login:", error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}