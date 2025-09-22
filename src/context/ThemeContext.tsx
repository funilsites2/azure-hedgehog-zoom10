"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeColors = {
  background: string;
  text: string;
  buttonBg: string;
  buttonText: string;
  progress: string;
};

type ThemeContextType = ThemeColors & {
  setColor: (key: keyof ThemeColors, value: string) => void;
};

const STORAGE_KEY = "client_theme_colors";

const defaultColors: ThemeColors = {
  background: "#1f2937", // gray-800
  text: "#ffffff",
  buttonBg: "#10b981", // emerald-500
  buttonText: "#ffffff",
  progress: "#22c55e", // green-500
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeColors>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultColors;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    // aplica variáveis CSS no root
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--client-${key}`, value);
    });
  }, [theme]);

  const setColor = (key: keyof ThemeColors, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider value={{ ...theme, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};