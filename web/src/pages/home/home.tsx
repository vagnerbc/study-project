import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useTheme } from "../../theme/useTheme";

export function HomePage() {
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <main style={{ maxWidth: 800, margin: "80px auto" }}>
      <h1>Área protegida</h1>

      <p>Olá, {user?.name}</p>
      <p>E-mail: {user?.email}</p>

      <section className="flex flex-row gap-4">
        <button className="p-2 bg-cyan-600" onClick={() => toggleTheme()}>
          Toggle Theme
        </button>
      </section>

      <section className="flex flex-row gap-4">
        <h2>Menu</h2>
        <ul>
          <li>
            <Link to="/app">Home</Link>
          </li>
          <li>
            <Link to="/simple-import">Simple Import</Link>
          </li>
        </ul>
      </section>

      <section>
        <button onClick={logout}>Sair</button>
      </section>
    </main>
  );
}
