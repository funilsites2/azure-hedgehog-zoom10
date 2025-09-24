"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

  useEffect(() => {
    if (photoUrl) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photoUrl));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [photoUrl]);

  const setPhoto = (url: string) => setPhotoUrl(url);
  const removePhoto = () => setPhotoUrl(null);

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