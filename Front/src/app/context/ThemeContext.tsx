import { createContext, useContext, useState, ReactNode } from "react";

export type Theme = "dark" | "light";

interface ThemeColors {
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  navBg: string;
}

const dark: ThemeColors = {
  bg: "#0a0a0c",
  surface: "#111116",
  surface2: "#1a1a22",
  surface3: "#22222e",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.15)",
  text: "#ffffff",
  textMuted: "#9ca3af",
  textSubtle: "rgba(255,255,255,0.35)",
  navBg: "rgba(12,12,18,0.92)",
};

const light: ThemeColors = {
  bg: "#f2f2f8",
  surface: "#ffffff",
  surface2: "#eaeaf4",
  surface3: "#e0e0ee",
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.18)",
  text: "#0a0a14",
  textMuted: "#6b7280",
  textSubtle: "rgba(0,0,0,0.35)",
  navBg: "rgba(240,240,248,0.92)",
};

interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  colors: dark,
  toggle: () => {},
  isDark: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const colors = theme === "dark" ? dark : light;
  return (
    <ThemeContext.Provider value={{ theme, colors, toggle, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
