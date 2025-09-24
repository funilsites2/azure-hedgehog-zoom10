"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type PhotoContextType = {
  photoUrl: string | null;
  setPhoto: (url: string) => void;
  removePhoto: () => void;
};

const STORAGE_KEY = "aluno_photo";

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // Carrega avatar do Supabase se logado
  useEffect(() => {
    let active = true;
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (data && data.avatar_url) {
        setPhotoUrl(data.avatar_url);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.avatar_url));
      }
    };
    run().catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (photoUrl) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photoUrl));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [photoUrl]);

  const setPhoto = (url: string) => {
    setPhotoUrl(url);
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .upsert({ id: user.id, avatar_url: url, updated_at: new Date().toISOString() }, { onConflict: "id" })
        .then(() => {})
        .catch(() => {});
    });
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq("id", user.id)
        .then(() => {})
        .catch(() => {});
    });
  };

  return (
    <PhotoContext.Provider value={{ photoUrl, setPhoto, removePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhoto = () => {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error("usePhoto must be used within PhotoProvider");
  return ctx;
};