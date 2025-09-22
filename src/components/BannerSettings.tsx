"use client";

import React, { useState } from "react";
import { useBanner } from "@/context/BannerContext";
import { Button } from "@/components/ui/button";

export const BannerSettings: React.FC = () => {
  const { bannerUrl, setBanner, removeBanner } = useBanner();
  const [inputUrl, setInputUrl] = useState("");

  const handleSet = () => {
    if (inputUrl.trim()) {
      setBanner(inputUrl.trim());
      setInputUrl("");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Banner Aluno</h3>
      {bannerUrl ? (
        <div className="flex flex-col items-start gap-2">
          <img src={bannerUrl} alt="Banner Aluno" className="w-full object-cover rounded-lg" />
          <Button variant="secondary" onClick={removeBanner}>
            Remover Banner
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded bg-neutral-800 text-white"
            placeholder="URL do banner"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <Button onClick={handleSet}>Adicionar Banner</Button>
        </div>
      )}
    </div>
  );
};