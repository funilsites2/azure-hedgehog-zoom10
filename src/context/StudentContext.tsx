"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type StudentContextType = {
  name: string;
  setName: (name: string) => void;
};

const STORAGE_KEY = "student_name";

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : "";
  });

  useEffect(() => {
    if (name) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(name));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [name]);

  const setName = (newName: string) => setNameState(newName);

  return (
    <StudentContext.Provider value={{ name, setName }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
};