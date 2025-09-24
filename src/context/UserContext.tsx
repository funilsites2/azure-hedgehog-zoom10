"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type UserContextType = {
  name: string;
  setName: (name: string) => void;
};

const STORAGE_KEY = "aluno_name";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : "Aluno";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(name));
  }, [name]);

  const setName = (newName: string) => setNameState(newName);

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