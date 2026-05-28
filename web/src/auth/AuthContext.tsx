import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, setAccessToken } from "../api/api";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const response = await api.get<User>("/auth/me");

    setUser(response.data);
  }

  async function refreshSessionOnStart() {
    try {
      const response = await api.post<{ accessToken: string }>("/auth/refresh");

      setAccessToken(response.data.accessToken);

      await loadMe();
    } catch (error) {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshSessionOnStart();
  }, []);

  async function login(input: { email: string; password: string }) {
    const response = await api.post<{ accessToken: string }>(
      "/auth/login",
      input,
    );

    setAccessToken(response.data.accessToken);

    await loadMe();
  }

  async function register(input: {
    name: string;
    email: string;
    password: string;
  }) {
    const response = await api.post<{ accessToken: string }>(
      "/auth/register",
      input,
    );

    setAccessToken(response.data.accessToken);

    await loadMe();
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
