import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home/home";
import SimpleLogin from "./pages/login/simpleLogin";
import { PublicPage } from "./pages/public/public";
import { RegisterPage } from "./pages/register/register";
import SearchPage from "./pages/search/debouce";
import { ShoppingCartPage } from "./pages/shoppingCart";
import { SimpleImport } from "./pages/simpleImport";
import { StreamImport } from "./pages/streamImport";
import { PrivateRoute } from "./secury/privateRoute";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<SimpleLogin />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/shoppingCart" element={<ShoppingCartPage />} />

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
