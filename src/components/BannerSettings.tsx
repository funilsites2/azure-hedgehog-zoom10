"use client";

import React, { useState } from "react";
import { useBanner } from "@/context/BannerContext";
import { Button } from "@/components/ui/button";

export const BannerSettings: React.FC = () => {
  const { banners, addBanner, removeBanner } = useBanner();
  const [inputUrl, setInputUrl] = useState("");

  const handleAdd = () => {
    addBanner(inputUrl);
    setInputUrl("");
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Banners Aluno (máx 3)</h3>
      <div className="space-y-4">
        {banners.map((url, idx) => (
          <div key={idx} className="flex flex-col items-start gap-2">
            <img src={url} alt={`Banner ${idx + 1}`} className="w-full object-cover rounded-lg" />
            <Button variant="secondary" onClick={() => removeBanner(idx)}>
              Remover Banner
            </Button>
          </div>
        ))}
        {banners.length < 3 && (
          <div className="flex gap-2">
            <input
              className="flex-1 p-2 rounded bg-neutral-800 text-white"
              placeholder="URL do banner"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            <Button onClick={handleAdd}>Adicionar Banner</Button>
          </div>
        )}
      </div>
    </div>
);
};