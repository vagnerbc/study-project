import { useAuth } from "../../auth/AuthContext";

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main style={{ maxWidth: 800, margin: "80px auto" }}>
      <h1>Área protegida</h1>

      <p>Olá, {user?.name}</p>
      <p>E-mail: {user?.email}</p>

      <button onClick={logout}>Sair</button>
    </main>
  );
}
