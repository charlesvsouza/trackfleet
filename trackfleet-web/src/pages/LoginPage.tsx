import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 

function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      // 🔥 AGORA É REAL: Passa o objeto com as credenciais
      await login({ email, password });

      // Se não der erro, redireciona para a Home (Mapa)
      navigate("/", { replace: true });
      
    } catch (err) {
      console.error("Erro no login:", err);
      // Mensagem genérica para segurança, ou personalizada se o backend retornar detalhes
      setError("Email ou senha inválidos.");
    }
  }

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundColor: "#f5f5f5" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: 400, 
        padding: "40px", 
        backgroundColor: "white", 
        borderRadius: "8px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#1976d2" }}>TrackFleet Admin</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Email</label>
            <input
              type="email"
              value={email}
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@trackfleet.com"
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Senha</label>
            <input
              type="password"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="******"
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: "12px", 
              backgroundColor: "#1976d2", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Validando..." : "Acessar Painel"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#d32f2f", textAlign: "center", marginTop: "16px", fontSize: "14px", fontWeight: "bold" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;