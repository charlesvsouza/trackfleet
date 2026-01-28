import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setLocalError("Email é obrigatório");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
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
      await login(normalizedEmail, password);
      navigate("/", { replace: true });
    } catch {
      // erro já tratado no AuthContext
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
            disabled={isLoading}
            onChange={(e) => {
              setEmail(e.target.value);
              setLocalError("");
            }}
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
            disabled={isLoading}
            onChange={(e) => {
              setPassword(e.target.value);
              setLocalError("");
            }}
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
          aria-busy={isLoading}
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
