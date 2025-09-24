"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserContextType = {
  name: string;
  setName: (name: string) => void;
};

const STORAGE_KEY = "aluno_name";
const UserContext = createContext<UserContextType | undefined>(undefined);

async function upsertProfileName(firstName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, first_name: firstName, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) throw error;
  return true;
}

async function fetchProfileName(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data?.first_name ?? null;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : "Aluno";
  });

  // Carrega do Supabase (se logado)
  useEffect(() => {
    let active = true;
    const run = async () => {
      const profileName = await fetchProfileName();
      if (!active) return;
      if (profileName && profileName.trim()) {
        setNameState(profileName);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profileName));
      }
    };
    run().catch(() => {});
    return () => { active = false; };
  }, []);

  const setName = (newName: string) => {
    setNameState(newName);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newName));
    upsertProfileName(newName).catch(() => {});
  };

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser deve ser usado dentro do UserProvider");
  return ctx;
};