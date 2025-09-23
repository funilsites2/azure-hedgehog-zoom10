"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Lock, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useModulos } from "@/context/ModulosContext";

type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
  assistida?: boolean;
  bloqueado?: boolean;
  releaseDate?: number;
  iniciado?: boolean;
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

function getYoutubeThumbnail(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "/placeholder.svg";
}

export function AulaPlayer({
  modulo,
  aulaSelecionadaId,
  onSelecionarAula,
  onMarcarAssistida,
}: AulaPlayerProps) {
  const { name } = useUser();
  const { iniciarAula } = useModulos();
  const aulas = modulo.aulas;
  const now = Date.now();

  const aulaIndex = aulas.findIndex((a) => a.id === aulaSelecionadaId);
  const aula = aulas[aulaIndex] ?? aulas[0];

  const total = aulas.length;
  const done = aulas.filter((a) => a.assistida).length;
  const progresso = total ? Math.round((done / total) * 100) : 0;

  const isLockedCurrent =
    aula.bloqueado === true || (aula.releaseDate ? now < aula.releaseDate : false);

  // playback tracking
  const [playing, setPlaying] = useState(false);
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [reported, setReported] = useState(false);

  // reset when switching aula
  useEffect(() => {
    setPlaying(false);
    setSecondsWatched(0);
    setReported(false);
  }, [aula.id]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (playing) {
      interval = setInterval(() => {
        setSecondsWatched((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing]);

  // when reaching 5 seconds, mark as started
  useEffect(() => {
    if (!reported && secondsWatched >= 5) {
      iniciarAula(modulo.id, aula.id);
      setReported(true);
    }
  }, [secondsWatched, reported, iniciarAula, modulo.id, aula.id]);

  if (!aulas || aulas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-neutral-300">Nenhuma aula disponível neste módulo.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      {/* Vídeo */}
      <div className="w-full md:w-2/3 flex flex-col pl-4 md:pl-8">
        <div className="flex justify-between items-center mb-2">
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
          <span className="text-xs text-neutral-300">{progresso}% concluído</span>
        </div>
        {isLockedCurrent ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-300">
            <Lock size={48} className="text-red-500 mb-4" />
            <p className="text-lg">
              Aula "{aula.titulo}" bloqueada até{" "}
              {aula.releaseDate ? new Date(aula.releaseDate).toLocaleString() : ""}
              .
            </p>
          </div>
        ) : (
          <>
            {!playing ? (
              <div
                className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg relative flex items-center justify-center cursor-pointer"
                onClick={() => setPlaying(true)}
              >
                <img
                  src={getYoutubeThumbnail(aula.videoUrl)}
                  alt={aula.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 rounded-full p-4">
                    <Play size={36} className="text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg">
                <iframe
                  src={aula.videoUrl}
                  title={aula.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
            <div className="text-xs text-neutral-400 mb-2">
              Tempo assistido: {secondsWatched}s {reported && "(registrado)"}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      <div className="w-full md:w-1/3 overflow-auto space-y-4">
        {aulas.map((a) => {
          const blockedByDate = a.releaseDate ? now < a.releaseDate : false;
          const blockedSequential = a.bloqueado === true && !blockedByDate;
          const blocked = blockedByDate || blockedSequential;
          return (
            <div
              key={a.id}
              className={cn(
                "relative rounded-lg overflow-hidden cursor-pointer",
                blocked && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !blocked && onSelecionarAula(a.id)}
            >
              {blockedByDate && (
                <div className="absolute top-0 inset-x-0 bg-yellow-500 text-black text-xs text-center py-1 z-10 rounded-t-lg">
                  Liberado em {new Date(a.releaseDate!).toLocaleString()}
                </div>
              )}
              {blockedSequential && (
                <div className="absolute top-0 inset-x-0 bg-red-500 text-white text-xs text-center py-1 z-10 rounded-t-lg">
                  Assista a aula anterior para desbloquear
                </div>
              )}
              <img
                src={getYoutubeThumbnail(a.videoUrl)}
                alt={a.titulo}
                className="w-full h-20 object-cover rounded-lg"
              />
              {blocked && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Lock size={24} className="text-white" />
                </div>
              )}
              <p className="text-sm text-white mt-1 px-1 truncate">{a.titulo}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}