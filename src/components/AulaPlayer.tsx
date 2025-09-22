"use client";

import { useState } from "react";
import { CheckCircle, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useStudentTheme } from "@/context/StudentThemeContext";

type Aula = { /* ... mesmo */ };
type Modulo = { /* ... mesmo */ };

export function AulaPlayer({ /* ... props */ }: any) {
  const { name } = useUser();
  const { buttonColor } = useStudentTheme();
  // ... restante do componente

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      <div className="w-full md:w-2/3 flex flex-col pl-4 md:pl-8">
        <div className="flex justify-between items-center mb-2">
          {!aula.assistida ? (
            <button
              className="text-xs px-3 py-1 rounded text-white"
              onClick={() => onMarcarAssistida(aula.id)}
              style={{ backgroundColor: buttonColor }}
            >
              Concluir Aula
            </button>
          ) : (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle size={16} /> Concluída
            </span>
          )}
          <span className="text-xs text-neutral-300">{progresso}% concluído</span>
        </div>
        {/* ... resto igual */}
      </div>
      {/* ... miniaturas */}
    </div>
  );
}