"use client";

import React, { useState } from "react";
import { useStudentSettings } from "@/context/StudentSettingsContext";
import { Button } from "@/components/ui/button";

export const StudentSettings: React.FC = () => {
  const { color, setColor, logoUrl, setLogo, removeLogo } = useStudentSettings();
  const [logoInput, setLogoInput] = useState("");

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Configurações do Aluno</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Cor da área de membros</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 p-0 border-0"
          />
        </div>
        <div>
          <label className="block mb-1">Logo do Aluno</label>
          {logoUrl ? (
            <div className="flex flex-col items-start gap-2">
              <img src={logoUrl} alt="Logo Aluno" className="h-12 object-contain" />
              <Button variant="secondary" onClick={removeLogo}>
                Remover Logo
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 rounded bg-neutral-800 text-white"
                placeholder="URL da logo"
                value={logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (logoInput.trim()) {
                    setLogo(logoInput.trim());
                    setLogoInput("");
                  }
                }}
              >
                Adicionar Logo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
);
}