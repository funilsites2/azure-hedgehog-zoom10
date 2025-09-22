"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogo } from "@/context/LogoContext";

export const LogoSettings: React.FC = () => {
  const { logoUrl, setLogo, removeLogo } = useLogo();
  const [inputUrl, setInputUrl] = useState("");

  const handleSet = () => {
    if (inputUrl.trim()) {
      setLogo(inputUrl.trim());
      setInputUrl("");
    }
  };

  return (
    <div className="mb-6">
      {logoUrl ? (
        <div className="flex flex-col items-center gap-2">
          <img src={logoUrl} alt="Logo atual" className="w-20 h-20 object-contain" />
          <Button variant="secondary" onClick={removeLogo}>
            Remover Logo
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded bg-neutral-800 text-white"
            placeholder="URL da Logo"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <Button onClick={handleSet}>Salvar Logo</Button>
        </div>
      )}
    </div>
  );
};