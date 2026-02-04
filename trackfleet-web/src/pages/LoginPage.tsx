import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Ajuste para o caminho correto do nosso contexto
import { useAuth } from "../contexts/AuthContext"; 

function LoginPage() {
  const { login, isLoading } = useAuth(); // useAuth retorna isLoading, não loading
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      // O login do contexto espera (token, userData). 
      // Como estamos simulando, vou passar dados fictícios aqui para você testar a tela.
      // Numa API real, você faria o fetch aqui e passaria o resultado.
      const mockUser = {
        id: "1",
        email: email,
        name: "Usuário Teste",
        role: "Admin"
      };
      
      // Simula token
      login("token-falso-123", mockUser);

      navigate("/", { replace: true });
      
    } catch (err) {
      setError("Falha ao entrar. Verifique console.");
      console.error(err);
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
              marginTop: "10px"
            }}
          >
            {isLoading ? "Entrando..." : "Acessar Painel"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#d32f2f", textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

// 🔥 ISSO RESOLVE O ERRO DO APP.TSX
export default LoginPage;