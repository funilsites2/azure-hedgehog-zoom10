"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePhoto } from "@/context/PhotoContext";

export const PhotoSettings: React.FC = () => {
  const { photoUrl, setPhoto, removePhoto } = usePhoto();
  const [inputUrl, setInputUrl] = useState("");

  const handleSet = () => {
    if (inputUrl.trim()) {
      setPhoto(inputUrl.trim());
      setInputUrl("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-2">Foto de Perfil</h2>
      {photoUrl ? (
        <div className="flex flex-col items-center gap-2">
          <img
            src={photoUrl}
            alt="Foto atual"
            className="w-24 h-24 rounded-full border-2 border-green-500 object-cover"
          />
          <Button variant="secondary" onClick={removePhoto}>
            Remover Foto
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded bg-neutral-800 text-white"
            placeholder="URL da nova foto"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <Button onClick={handleSet}>Salvar</Button>
        </div>
      )}
    </div>
);
}