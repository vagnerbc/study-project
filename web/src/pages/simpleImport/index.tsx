import { ImportUploadPage } from "../imports/importUploadPage";

export const SimpleImport = () => {
  return (
    <ImportUploadPage
      description="Lê o CSV inteiro em memória, valida as linhas e depois persiste os produtos."
      endpoint="/imports/simple-import"
      strategy="Full file"
      title="Importacao simples"
    />
  );
};
