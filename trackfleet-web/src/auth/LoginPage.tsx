import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // Validação básica de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validação
    if (!email.trim()) {
      setLocalError("Email é obrigatório");
      return;
    }

    if (!isValidEmail(email)) {
      setLocalError("Email inválido");
      return;
    }

    if (!password) {
      setLocalError("Senha é obrigatória");
      return;
    }

    if (password.length < 6) {
      setLocalError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch {
      // O erro já é tratado no AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>

        {displayError && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {displayError}
          </p>
        )}
      </form>
    </div>
  );
}

