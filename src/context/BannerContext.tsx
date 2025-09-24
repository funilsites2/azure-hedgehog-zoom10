"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type BannerContextType = {
  bannerUrl: string | null;
  setBanner: (url: string) => void;
  removeBanner: () => void;
};

const STORAGE_KEY = "banner_area_aluno";
const BANNER_KEY = "banner_url";

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // Carrega do Supabase
  useEffect(() => {
    let active = true;
    const run = async () => {
      const { data } = await supabase
        .from("branding_settings")
        .select("value")
        .eq("key", BANNER_KEY)
        .maybeSingle();
      if (!active) return;
      if (data && typeof data.value === "string") {
        setBannerUrl(data.value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value));
      }
    };
    run().catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (bannerUrl) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bannerUrl));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [bannerUrl]);

  const setBanner = (url: string) => {
    setBannerUrl(url);
    // Persistir no Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      supabase
        .from("branding_settings")
        .upsert({
          key: BANNER_KEY,
          value: url,
          updated_by: user?.id ?? null,
          updated_at: new Date().toISOString(),
        })
        .then(() => {})
        .catch(() => {});
    });
  };

  const removeBanner = () => {
    setBannerUrl(null);
    // Remover no Supabase
    supabase
      .from("branding_settings")
      .delete()
      .eq("key", BANNER_KEY)
      .then(() => {})
      .catch(() => {});
  };

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