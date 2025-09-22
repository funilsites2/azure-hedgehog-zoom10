"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Settings = {
  color: string;
  logoUrl: string | null;
  setColor: (c: string) => void;
  setLogo: (url: string) => void;
  removeLogo: () => void;
};

const STORAGE_KEY = "settings_area_aluno";

const SettingsContext = createContext<Settings | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColorState] = useState<string>("#1f2937"); // default neutral-900
  const [logoUrl, setLogoUrlState] = useState<string | null>(null);

  // load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.color) setColorState(data.color);
        if (data.logoUrl) setLogoUrlState(data.logoUrl);
      } catch {}
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ color, logoUrl }));
  }, [color, logoUrl]);

  const setColor = (c: string) => setColorState(c);
  const setLogo = (url: string) => setLogoUrlState(url);
  const removeLogo = () => setLogoUrlState(null);

  return (
    <SettingsContext.Provider value={{ color, logoUrl, setColor, setLogo, removeLogo }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};