"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type LogoContextType = {
  logoUrl: string | null;
  setLogo: (url: string) => void;
  removeLogo: () => void;
};

const STORAGE_KEY = "logo_area_membros";

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logoUrl));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [logoUrl]);

  const setLogo = (url: string) => setLogoUrl(url);
  const removeLogo = () => setLogoUrl(null);

  return (
    <LogoContext.Provider value={{ logoUrl, setLogo, removeLogo }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const ctx = useContext(LogoContext);
  if (!ctx) throw new Error("useLogo must be used within LogoProvider");
  return ctx;
};