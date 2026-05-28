import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/home/home";
import { LoginPage } from "./pages/login/login";
import { PublicPage } from "./pages/public/public";
import { PrivateRoute } from "./secury/privateRoute";
import { RegisterPage } from "./pages/register/register";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
