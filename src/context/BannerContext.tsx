"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type BannerContextType = {
  banners: string[];
  addBanner: (url: string) => void;
  removeBanner: (index: number) => void;
};

const STORAGE_KEY = "banners_area_aluno";

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banners, setBanners] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (banners.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [banners]);

  const addBanner = (url: string) => {
    if (!url.trim() || banners.length >= 3) return;
    setBanners((prev) => [...prev, url.trim()]);
  };

  const removeBanner = (index: number) => {
    setBanners((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <BannerContext.Provider value={{ banners, addBanner, removeBanner }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error("useBanner deve ser usado dentro de BannerProvider");
  return ctx;
};