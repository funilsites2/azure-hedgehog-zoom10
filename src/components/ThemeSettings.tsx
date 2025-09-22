"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

export const ThemeSettings: React.FC = () => {
  const { background, text, buttonBg, buttonText, progress, setColor } = useTheme();

  const fields: { label: string; key: keyof typeof background }[] = [
    { label: "Fundo", key: "background" },
    { label: "Texto", key: "text" },
    { label: "Botão (BG)", key: "buttonBg" },
    { label: "Botão (Texto)", key: "buttonText" },
    { label: "Progresso", key: "progress" },
  ] as const;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold mb-2">Cores da Área do Cliente</h3>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ label, key }) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm mb-1">{label}</label>
            <input
              type="color"
              value={( { background, text, buttonBg, buttonText, progress } as any)[key]}
              onChange={(e) => setColor(key, e.target.value)}
              className="w-full h-8 p-0 border-0"
            />
          </div>
        ))}
      </div>
      <Button onClick={() => alert("Cores salvas!")}>Salvar Cores</Button>
    </div>
  );
};