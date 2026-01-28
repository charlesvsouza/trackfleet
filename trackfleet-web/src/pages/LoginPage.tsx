import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

console.log("✅ LoginPage.tsx carregado!");

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("📝 Formulário enviado!");
    console.log("Email:", email);
    console.log("Password:", password);
    setError(null);

    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "100px auto" }}>
      <h2>TrackFleet Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
