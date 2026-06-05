import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
};

const getInitialTheme = () => {
  const localTheme = localStorage.getItem("theme");

  if (localTheme) {
    return localTheme as ThemeType;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);

  const isDark = theme === "dark";
  const isLight = theme === "light";

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      return currentTheme === "dark" ? "light" : "dark";
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        isLight,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("Theme context does not exists");
  }

  return context;
}
