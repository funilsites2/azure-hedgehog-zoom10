"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type BannerContextType = {
  bannerUrl: string | null;
  setBanner: (url: string) => void;
  removeBanner: () => void;
};

const STORAGE_KEY = "banner_area_aluno";

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (bannerUrl) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bannerUrl));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [bannerUrl]);

  const setBanner = (url: string) => setBannerUrl(url);
  const removeBanner = () => setBannerUrl(null);

  return (
    <BannerContext.Provider value={{ bannerUrl, setBanner, removeBanner }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error("useBanner deve ser usado dentro de BannerProvider");
  return ctx;
};