import { Link } from "react-router-dom";

export function PublicPage() {
  return (
    <main className="app-shell">
      <div className="page-container">
        <h1>Pagina publica</h1>

        <Link className="text-link" to="/app">
          Entrar na area protegida
        </Link>
      </div>
    </main>
  );
}
