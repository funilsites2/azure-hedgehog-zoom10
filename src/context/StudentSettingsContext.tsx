"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type StudentSettings = {
  color: string;
  logoUrl: string | null;
  setColor: (color: string) => void;
  setLogo: (url: string) => void;
  removeLogo: () => void;
};

const STORAGE_KEY = "student_settings";

const StudentSettingsContext = createContext<StudentSettings | undefined>(undefined);

export const StudentSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [color, setColorState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        return obj.color || "#ffffff";
      } catch {}
    }
    return "#ffffff";
  });
  const [logoUrl, setLogoUrlState] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        return obj.logoUrl || null;
      } catch {}
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ color, logoUrl }));
  }, [color, logoUrl]);

  const setColor = (c: string) => setColorState(c);
  const setLogo = (url: string) => setLogoUrlState(url);
  const removeLogo = () => setLogoUrlState(null);

  return (
    <StudentSettingsContext.Provider
      value={{ color, logoUrl, setColor, setLogo, removeLogo }}
    >
      {children}
    </StudentSettingsContext.Provider>
  );
};

export const useStudentSettings = () => {
  const ctx = useContext(StudentSettingsContext);
  if (!ctx) throw new Error("useStudentSettings deve ser usado dentro de StudentSettingsProvider");
  return ctx;
};