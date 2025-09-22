"use client";

import { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
  assistida?: boolean;
  bloqueado?: boolean;
  releaseDate?: number;
};

type Modulo = {
  id: number;
  nome: string;
  aulas: Aula[];
};

interface AulaPlayerProps {
  modulo: Modulo;
  aulaSelecionadaId: number;
  onSelecionarAula: (aulaId: number) => void;
  onMarcarAssistida: (aulaId: number) => void;
}

export function AulaPlayer({
  modulo,
  aulaSelecionadaId,
  onSelecionarAula,
  onMarcarAssistida,
}: AulaPlayerProps) {
  const { name } = useUser();
  const aulas = modulo.aulas;

  if (!aulas || aulas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-neutral-300">Nenhuma aula disponível neste módulo.</span>
      </div>
    );
  }

  const aulaIndex = aulas.findIndex((a) => a.id === aulaSelecionadaId);
  const aula = aulas[aulaIndex] ?? aulas[0];
  const hasPrev = aulaIndex > 0;
  const hasNext = aulaIndex < aulas.length - 1;

  const totalAulasModulo = aulas.length;
  const assistidasModulo = aulas.filter((a) => a.assistida).length;
  const progressoModulo = totalAulasModulo
    ? Math.round((assistidasModulo / totalAulasModulo) * 100)
    : 0;

  const [tab, setTab] = useState("video");
  const embedUrl = aula.videoUrl;

  const now = Date.now();
  const isLocked =
    aula.bloqueado === true || (aula.releaseDate && now < aula.releaseDate);

  if (isLocked) {
    const releaseText = aula.releaseDate
      ? new Date(aula.releaseDate).toLocaleDateString()
      : "";
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-300">
        <Lock size={48} className="text-red-500 mb-4" />
        <p className="text-lg">
          Aula "{aula.titulo}" bloqueada{releaseText && ` até ${releaseText}`}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      <div className="w-full md:w-2/3 flex flex-col pl-4 md:pl-8">
        <div className="flex justify-end items-center mb-2">
          {!aula.assistida ? (
            <button
              className="text-xs bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-white"
              onClick={() => onMarcarAssistida(aula.id)}
            >
              Concluir Aula
            </button>
          ) : (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle size={16} /> Concluída
            </span>
          )}
        </div>
        <div className="mb-4 px-2">
          <Progress value={progressoModulo} className="h-2 bg-neutral-800" />
          <div className="text-xs text-neutral-400 mt-1">
            {progressoModulo}% do módulo concluído
          </div>
        </div>
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg">
          <iframe
            src={embedUrl}
            title={aula.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* ... restante inalterado */}
      </div>

      {/* ... restante inalterado */}
    </div>
);
}