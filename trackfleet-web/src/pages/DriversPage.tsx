import { useEffect, useState } from "react";
import api from "../services/api"; // Certifique-se que o caminho está certo

interface Driver {
  id: string;
  name: string;
  email: string;
  cnh: string;
  currentVehiclePlate?: string;
}

export function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnh, setCnh] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    try {
      const response = await api.get("/drivers");
      setDrivers(response.data);
    } catch (error) {
      console.error("Erro ao carregar motoristas", error);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/drivers", { name, email, cnh });
      alert("Motorista cadastrado!");
      setName("");
      setEmail("");
      setCnh("");
      loadDrivers();
    } catch (error) {
      alert("Erro ao criar motorista");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Gestão de Motoristas</h1>
      
      {/* Formulário Simples */}
      <div style={{ background: "#f4f4f4", padding: 15, marginBottom: 20, borderRadius: 8 }}>
        <h3>Novo Motorista</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input 
            placeholder="Nome" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            style={{ padding: 8 }}
          />
          <input 
            placeholder="Email Google" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={{ padding: 8 }}
          />
          <input 
            placeholder="CNH" 
            value={cnh} 
            onChange={e => setCnh(e.target.value)} 
            style={{ padding: 8 }}
          />
          <button type="submit" style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Cadastrar
          </button>
        </form>
      </div>

      {/* Lista */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#ddd", textAlign: "left" }}>
            <th style={{ padding: 10 }}>Nome</th>
            <th style={{ padding: 10 }}>Email</th>
            <th style={{ padding: 10 }}>CNH</th>
            <th style={{ padding: 10 }}>Veículo Atual</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(driver => (
            <tr key={driver.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 10 }}>{driver.name}</td>
              <td style={{ padding: 10 }}>{driver.email}</td>
              <td style={{ padding: 10 }}>{driver.cnh}</td>
              <td style={{ padding: 10 }}>
                {driver.currentVehiclePlate ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>🚗 {driver.currentVehiclePlate}</span>
                ) : (
                  <span style={{ color: "#999" }}>Nenhum</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}