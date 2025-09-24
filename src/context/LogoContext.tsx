"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type LogoContextType = {
  logoUrl: string | null;
  setLogo: (url: string) => void;
  removeLogo: () => void;
};

const STORAGE_KEY = "logo_area_membros";
const LOGO_KEY = "logo_url";

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
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
        .eq("key", LOGO_KEY)
        .maybeSingle();
      if (!active) return;
      if (data && typeof data.value === "string") {
        setLogoUrl(data.value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value));
      }
    };
    run().catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logoUrl));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [logoUrl]);

  const setLogo = (url: string) => {
    setLogoUrl(url);
    supabase.auth.getUser().then(({ data: { user } }) => {
      supabase
        .from("branding_settings")
        .upsert({
          key: LOGO_KEY,
          value: url,
          updated_by: user?.id ?? null,
          updated_at: new Date().toISOString(),
        })
        .then(() => {})
        .catch(() => {});
    });
  };

  const removeLogo = () => {
    setLogoUrl(null);
    supabase
      .from("branding_settings")
      .delete()
      .eq("key", LOGO_KEY)
      .then(() => {})
      .catch(() => {});
  };

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