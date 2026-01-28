import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("📝 Login.TSX - Formulário enviado!");
    console.log("Email:", email);
    setError("");

    try {
      console.log("🔐 Chamando login...");
      await login(email, password);
      console.log("✅ Login bem-sucedido!");
      window.location.href = "/";
    } catch (err: any) {
      console.error("❌ Erro:", err);
      setError("Credenciais inválidas");
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "100px auto" }}>
      <h2>TrackFleet</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
