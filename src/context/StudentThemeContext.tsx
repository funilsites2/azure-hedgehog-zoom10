"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type StudentTheme = {
  backgroundColor: string;
  buttonColor: string;
  progressColor: string;
  setBackgroundColor: (c: string) => void;
  setButtonColor: (c: string) => void;
  setProgressColor: (c: string) => void;
};

const STORAGE_KEY = "student_theme";

const defaultTheme = {
  backgroundColor: "#1f2937", // gray-800
  buttonColor: "#10b981",     // green-500
  progressColor: "#10b981",   // green-500
};

const Context = createContext<StudentTheme | undefined>(undefined);

export const StudentThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as typeof defaultTheme : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  const setBackgroundColor = (c: string) => setTheme((t) => ({ ...t, backgroundColor: c }));
  const setButtonColor = (c: string) => setTheme((t) => ({ ...t, buttonColor: c }));
  const setProgressColor = (c: string) => setTheme((t) => ({ ...t, progressColor: c }));

  return (
    <Context.Provider value={{ ...theme, setBackgroundColor, setButtonColor, setProgressColor }}>
      {children}
    </Context.Provider>
  );
};

export function useStudentTheme() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useStudentTheme must be used within StudentThemeProvider");
  return ctx;
}