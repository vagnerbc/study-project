import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home/home";
import { LoginPage } from "./pages/login/login";
import { PublicPage } from "./pages/public/public";
import { RegisterPage } from "./pages/register/register";
import { SimpleImport } from "./pages/simpleImport";
import { StreamImport } from "./pages/streamImport";
import { PrivateRoute } from "./secury/privateRoute";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/app"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/simple-import"
          element={
            <PrivateRoute>
              <SimpleImport />
            </PrivateRoute>
          }
        />

        <Route
          path="/simple-import-stream"
          element={
            <PrivateRoute>
              <StreamImport />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
