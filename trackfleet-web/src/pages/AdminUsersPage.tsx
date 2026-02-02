import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { UserDto } from "@/api/users.api";

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setUsers(await userService.list());
    } catch {
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id: string) {
    await userService.toggleStatus(id);
    load();
  }

  async function changeRole(id: string, role: string) {
    await userService.updateRole(id, role);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Usuários</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {loading ? (
        <p>Carregando…</p>
      ) : (
        <table width="100%" cellPadding={8}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nome</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.fullName}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={e =>
                      changeRole(u.id, e.target.value)
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="driver">Driver</option>
                  </select>
                </td>
                <td>{u.isActive ? "Ativo" : "Inativo"}</td>
                <td>
                  <button onClick={() => toggleStatus(u.id)}>
                    {u.isActive ? "Desativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
