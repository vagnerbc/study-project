import { ImportUploadPage } from "../imports/importUploadPage";

export const StreamImport = () => {
  return (
    <ImportUploadPage
      description="Percorre o CSV como stream, processa em lotes e usa transaction para rollback em caso de erro."
      endpoint="/imports/simple-import-stream"
      strategy="Stream + batch"
      title="Importacao com stream"
    />
  );
};
