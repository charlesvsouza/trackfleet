import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Ajuste o import do useAuth conforme sua estrutura real
// Se der erro aqui, tente: import { useAuth } from "../auth/useAuth";
import { useAuth } from "@/auth/useAuth";

export function LoginPage() { // MUDANÇA: 'export function' em vez de 'export default'
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const user = await login(email.trim(), password);

      // Redirecionamento inteligente baseado no Role
      if (user.role === "Admin") {
        navigate("/admin/users", { replace: true }); // Ajustei para uma rota que vimos no AppRoutes
      } else {
        navigate("/dashboard", { replace: true }); // Ajustei para o dashboard padrão
      }
    } catch {
      setError("Credenciais inválidas");
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>TrackFleet Login</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px" }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}