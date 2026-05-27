import { Link } from "react-router-dom";

export function PublicPage() {
  return (
    <main style={{ maxWidth: 800, margin: "80px auto" }}>
      <h1>Página pública</h1>

      <Link to="/app">Entrar na área protegida</Link>
    </main>
  );
}
