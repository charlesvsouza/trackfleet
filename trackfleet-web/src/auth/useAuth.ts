import { useContext } from "react";
// Importa do diretório de contextos (sobe um nível com ../)
import { AuthContext, AuthContextType } from "../contexts/AuthContext";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}