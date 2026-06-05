import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useTheme } from "../../theme/useTheme";

export function HomePage() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <main className="app-shell">
      <div className="page-container">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">Area protegida</span>
            <h1>Imports</h1>
            <p>
              Ola, {user?.name}. Escolha uma estrategia para importar produtos
              por CSV.
            </p>
          </div>

          <div className="header-actions">
            <button className="secondary-button" onClick={toggleTheme}>
              {isDark ? "Tema claro" : "Tema escuro"}
            </button>
            <button className="secondary-button" onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        <section className="user-strip">
          <span>{user?.email}</span>
        </section>

        <section className="import-grid">
          <Link className="import-card" to="/simple-import">
            <span className="strategy-badge">Full file</span>
            <h2>Importacao simples</h2>
            <p>
              Le o arquivo inteiro, valida as linhas e persiste tudo de uma vez.
              Boa para estudar o fluxo base e arquivos pequenos.
            </p>
            <span className="card-action">Abrir tela</span>
          </Link>

          <Link className="import-card" to="/simple-import-stream">
            <span className="strategy-badge">Stream + batch</span>
            <h2>Importacao com stream</h2>
            <p>
              Processa o CSV linha a linha, salva em lotes e permite rollback em
              caso de erro de validacao.
            </p>
            <span className="card-action">Abrir tela</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
