import type { AxiosError } from "axios";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";

type ImportUploadPageProps = {
  title: string;
  description: string;
  endpoint: string;
  strategy: string;
};

type ImportResponse = {
  message: string;
  imported?: number;
  errors?: Array<{
    row: number;
    errors: string[];
  }>;
};

type UploadStatus =
  | { type: "idle" }
  | { type: "success"; message: string; imported?: number }
  | { type: "error"; message: string; errors?: ImportResponse["errors"] };

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export function ImportUploadPage({
  title,
  description,
  endpoint,
  strategy,
}: ImportUploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<UploadStatus>({ type: "idle" });

  const fileSummary = useMemo(() => {
    if (!file) {
      return "Nenhum arquivo selecionado";
    }

    return `${file.name} - ${formatFileSize(file.size)}`;
  }, [file]);

  const fileOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setStatus({ type: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setStatus({
        type: "error",
        message: "Selecione um arquivo CSV antes de importar.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsSubmitting(true);
      setStatus({ type: "idle" });

      const response = await api.post<ImportResponse>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus({
        type: "success",
        message: response.data.message,
        imported: response.data.imported,
      });
      setFile(null);
      event.currentTarget.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ImportResponse>;

      setStatus({
        type: "error",
        message:
          axiosError.response?.data.message ||
          "Nao foi possivel importar o arquivo.",
        errors: axiosError.response?.data.errors,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="page-container">
        <header className="page-header">
          <div>
            <Link className="text-link" to="/app">
              Voltar
            </Link>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <span className="strategy-badge">{strategy}</span>
        </header>

        <section className="upload-layout">
          <form className="upload-panel" onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="file">
                Arquivo CSV
              </label>
              <label className="file-dropzone" htmlFor="file">
                <span className="file-dropzone-title">Selecionar arquivo</span>
                <span className="file-dropzone-description">
                  Use um CSV com as colunas name, sku, price e stock.
                </span>
                <span className="file-name">{fileSummary}</span>
              </label>
              <input
                accept=".csv,text/csv"
                className="sr-only"
                id="file"
                name="file"
                onChange={fileOnChange}
                type="file"
              />
            </div>

            <button className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? "Importando..." : "Importar CSV"}
            </button>
          </form>

          <aside className="details-panel">
            <h2>Formato esperado</h2>
            <div className="csv-preview">
              <code>name,sku,price,stock</code>
              <code>Notebook,NB-001,4500.90,12</code>
              <code>Mouse,MS-002,89.90,40</code>
            </div>

            {status.type === "success" && (
              <div className="status-box status-success">
                <strong>{status.message}</strong>
                <span>{status.imported ?? 0} registros importados.</span>
              </div>
            )}

            {status.type === "error" && (
              <div className="status-box status-error">
                <strong>{status.message}</strong>

                {status.errors && status.errors.length > 0 && (
                  <ul className="error-list">
                    {status.errors.map((rowError) => (
                      <li key={rowError.row}>
                        Linha {rowError.row}: {rowError.errors.join(", ")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
