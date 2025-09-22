"use client";

import React, { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";

export const SettingsForm: React.FC = () => {
  const { color, logoUrl, setColor, setLogo, removeLogo } = useSettings();
  const [inputLogo, setInputLogo] = useState("");

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Aparência Aluno</h3>
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm">Cor de fundo:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 p-0 border-0"
        />
      </div>
      {logoUrl ? (
        <div className="flex flex-col items-start gap-2 mb-4">
          <img src={logoUrl} alt="Logo Aluno" className="h-12 object-contain" />
          <Button variant="secondary" onClick={removeLogo}>
            Remover Logo
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 p-2 rounded bg-neutral-800 text-white"
            placeholder="URL da logo"
            value={inputLogo}
            onChange={(e) => setInputLogo(e.target.value)}
          />
          <Button onClick={() => { setLogo(inputLogo.trim()); setInputLogo(""); }}>
            Adicionar Logo
          </Button>
        </div>
      )}
    </div>
  );
};