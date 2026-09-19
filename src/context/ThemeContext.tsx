import React, { createContext, useContext, useState, useEffect } from "react";
import { AppTheme } from "../types";

interface ThemeContextType {
  theme: AppTheme;
  isLightMode: boolean;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "afriversty_theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light-academic" || saved === "deep-night") {
        return saved;
      }
    } catch {
      // Fallback to default
    }
    return "deep-night";
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === "light-academic") {
      root.classList.remove("theme-deep-night");
      root.classList.add("theme-light-academic");
      body.classList.remove("theme-deep-night");
      body.classList.add("theme-light-academic");
      root.setAttribute("data-theme", "light-academic");
    } else {
      root.classList.remove("theme-light-academic");
      root.classList.add("theme-deep-night");
      body.classList.remove("theme-light-academic");
      body.classList.add("theme-deep-night");
      root.setAttribute("data-theme", "deep-night");
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore local storage errors
    }
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "deep-night" ? "light-academic" : "deep-night"));
  };

  const isLightMode = theme === "light-academic";

  return (
    <ThemeContext.Provider value={{ theme, isLightMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
