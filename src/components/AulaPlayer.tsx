"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useModulos } from "@/context/ModulosContext";
import SimpleProgress from "@/components/SimpleProgress";

type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
  assistida?: boolean;
  bloqueado?: boolean;
  releaseDate?: number;
  started?: boolean;
  descricao?: string;
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

function getYoutubeId(url: string): string | null {
  const m =
    url.match(
      /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    ) ||
    url.match(/(?:v=|\/v\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getYoutubeThumbnail(url: string): string {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/placeholder.svg";
}

export function AulaPlayer({
  modulo,
  aulaSelecionadaId,
  onSelecionarAula,
  onMarcarAssistida,
}: AulaPlayerProps) {
  const { name } = useUser();
  const { marcarAulaIniciada } = useModulos();
  const aulas = modulo.aulas;
  const now = Date.now();
  const timerRef = useRef<number | null>(null);

  const [videoProgress, setVideoProgress] = useState<number>(0);

  const playerRef = useRef<any | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const lastSavedTimeRef = useRef<number>(0);
  const lastSavedPctRef = useRef<number>(0);

  const assistedTriggeredRef = useRef<boolean>(false);

  if (!aulas || aulas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-neutral-300">Nenhuma aula disponível neste módulo.</span>
      </div>
    );
  }

  const aulaIndex = aulas.findIndex((a) => a.id === aulaSelecionadaId);
  const aula = aulas[aulaIndex] ?? aulas[0];

  const total = aulas.length;
  const done = aulas.filter((a) => a.assistida).length;
  const progressoModulo = total ? Math.round((done / total) * 100) : 0;

  const isLockedCurrent =
    aula.bloqueado === true || (aula.releaseDate ? now < aula.releaseDate : false);

  const timeKey = (id: number) => `aula_progress_time_${id}`;
  const pctKey = (id: number) => `aula_progress_pct_${id}`;

  useEffect(() => {
    assistedTriggeredRef.current = false;
  }, [aula.id]);

  useEffect(() => {
    if (!aula || aula.started || aula.assistida) return;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = window.setTimeout(() => {
      marcarAulaIniciada(modulo.id, aula.id);
      timerRef.current = null;
    }, 5000);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [aula?.id, aula?.started, aula?.assistida, marcarAulaIniciada, modulo.id]);

  const markAssistidaAndAdvance = (currentAulaId: number) => {
    if (assistedTriggeredRef.current) return;
    assistedTriggeredRef.current = true;

    onMarcarAssistida(currentAulaId);

    const idx = aulas.findIndex((x) => x.id === currentAulaId);
    const next = aulas[idx + 1];
    if (next) {
      const nowTs = Date.now();
      const nextLocked =
        next.bloqueado === true || (next.releaseDate ? nowTs < next.releaseDate : false);
      if (!nextLocked) {
        setTimeout(() => {
          onSelecionarAula(next.id);
        }, 250);
      }
    }
  };

  useEffect(() => {
    setVideoProgress(0);
    lastSavedTimeRef.current = 0;
    lastSavedPctRef.current = 0;
    assistedTriggeredRef.current = false;

    if (pollIntervalRef.current) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (playerRef.current && typeof playerRef.current.destroy === "function") {
      try {
        playerRef.current.destroy();
      } catch {}
      playerRef.current = null;
    }

    const ytId = getYoutubeId(aula.videoUrl);
    if (ytId && playerContainerRef.current) {
      const ensureYouTubeAPI = () =>
        new Promise<void>((resolve) => {
          if ((window as any).YT && (window as any).YT.Player) {
            resolve();
            return;
          }
          const existing = document.getElementById("youtube-api");
          if (existing) {
            existing.addEventListener("load", () => resolve(), { once: true });
            if ((window as any).YT && (window as any).YT.Player) resolve();
            return;
          }
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          tag.id = "youtube-api";
          tag.async = true;
          tag.onload = () => {
            setTimeout(() => resolve(), 50);
          };
          document.body.appendChild(tag);
        });

      let mounted = true;

      ensureYouTubeAPI().then(() => {
        if (!mounted) return;
        const YT = (window as any).YT;
        try {
          playerRef.current = new YT.Player(playerContainerRef.current, {
            videoId: ytId,
            playerVars: {
              modestbranding: 1,
              rel: 0,
              origin: window.location.origin,
              enablejsapi: 1,
              autoplay: 1,
              playsinline: 1,
            },
            events: {
              onReady: (event: any) => {
                const saved = parseFloat(localStorage.getItem(timeKey(aula.id)) || "0");
                if (saved && !isNaN(saved) && saved > 0) {
                  event.target.seekTo(saved, true);
                }
                event.target.playVideo();

                if (pollIntervalRef.current) {
                  window.clearInterval(pollIntervalRef.current);
                  pollIntervalRef.current = null;
                }
                pollIntervalRef.current = window.setInterval(() => {
                  const player = playerRef.current;
                  if (!player || typeof player.getCurrentTime !== "function") return;
                  const cur = player.getCurrentTime();
                  const dur = player.getDuration();
                  if (!dur || dur === 0 || !isFinite(dur)) {
                    setVideoProgress(0);
                    return;
                  }
                  const pct = Math.min(100, Math.max(0, Math.round((cur / dur) * 100)));
                  setVideoProgress(pct);

                  const lastSaved = lastSavedTimeRef.current || 0;
                  const lastPct = lastSavedPctRef.current || 0;
                  if (Math.abs(cur - lastSaved) > 2 || Math.abs(pct - lastPct) >= 1) {
                    lastSavedTimeRef.current = cur;
                    lastSavedPctRef.current = pct;
                    localStorage.setItem(timeKey(aula.id), String(cur));
                    localStorage.setItem(pctKey(aula.id), String(pct));
                  }

                  if (pct >= 100 && !aula.assistida && !assistedTriggeredRef.current) {
                    markAssistidaAndAdvance(aula.id);
                  }
                }, 500) as unknown as number;
              },
              onStateChange: (e: any) => {
                const YTStates = (window as any).YT?.PlayerState;
                if (e?.data === (YTStates?.ENDED ?? 0)) {
                  if (!aula.assistida && !assistedTriggeredRef.current) {
                    markAssistidaAndAdvance(aula.id);
                  }
                }
              },
            },
          });
        } catch {
          // fallback
        }
      });

      return () => {
        mounted = false;
        if (pollIntervalRef.current) {
          window.clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        if (playerRef.current && typeof playerRef.current.destroy === "function") {
          try {
            playerRef.current.destroy();
          } catch {}
          playerRef.current = null;
        }
      };
    } else {
      return () => {
        if (pollIntervalRef.current) {
          window.clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aula.id, aula.videoUrl]);

  useEffect(() => {
    if (aula.assistida) {
      setVideoProgress(100);
      assistedTriggeredRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aula.assistida]);

  const displayPercent =
    !isLockedCurrent && (aula.started || videoProgress > 0) ? videoProgress : progressoModulo;

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      {/* Vídeo */}
      <div className="w-full md:w-2/3 flex flex-col pl-4 md:pl-8">
        <div className="flex justify-between items-center mb-2">
          {!aula.assistida ? (
            <button
              className="text-xs bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-white"
              onClick={() => {
                onMarcarAssistida(aula.id);
                assistedTriggeredRef.current = true;
                const next = aulas[aulaIndex + 1];
                if (next) {
                  const nowTs = Date.now();
                  const nextLocked =
                    next.bloqueado === true ||
                    (next.releaseDate ? nowTs < next.releaseDate : false);
                  if (!nextLocked) {
                    setTimeout(() => {
                      onSelecionarAula(next.id);
                    }, 250);
                  }
                }
              }}
            >
              Concluir Aula
            </button>
          ) : (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle size={16} /> Concluída
            </span>
          )}
          <div className="flex items-center gap-3">
            <div className="w-36">
              <SimpleProgress value={progressoModulo} />
            </div>
            <span className="text-xs text-neutral-300">{progressoModulo}%</span>
          </div>
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
            {/* Contêiner do player com arredondamento e clip */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-3 shadow-lg flex items-stretch video-rounded">
              {getYoutubeId(aula.videoUrl) ? (
                <div
                  ref={playerContainerRef}
                  className="w-full h-full rounded-lg overflow-hidden video-frame"
                />
              ) : (
                <iframe
                  src={aula.videoUrl}
                  title={aula.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg overflow-hidden"
                />
              )}
            </div>
            {aula.descricao && (
              <p className="text-sm text-neutral-300 mb-4">{aula.descricao}</p>
            )}
          </>
        )}
      </div>

      {/* Miniaturas */}
      <div className="w-full md:w-1/3 overflow-auto space-y-4 pr-4">
        {aulas.map((a) => {
          const blockedByDate = a.releaseDate ? now < a.releaseDate : false;
          const blockedSequential = a.bloqueado === true && !blockedByDate;
          const blocked = blockedByDate || blockedSequential;

          let savedPct = 0;
          try {
            savedPct = Number(localStorage.getItem(pctKey(a.id)) || "0");
            if (!isFinite(savedPct) || savedPct < 0) savedPct = 0;
            if (savedPct > 100) savedPct = 100;
          } catch {
            savedPct = 0;
          }

          return (
            <div
              key={a.id}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl p-2 hover:bg-neutral-800/60 cursor-pointer",
                blocked && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !blocked && onSelecionarAula(a.id)}
            >
              {blockedByDate && (
                <div className="absolute top-0 inset-x-0 bg-yellow-500 text-black text-[10px] text-center py-1 z-10 rounded-t-xl">
                  Liberado em {new Date(a.releaseDate!).toLocaleString()}
                </div>
              )}
              {blockedSequential && (
                <div className="absolute top-0 inset-x-0 bg-red-500 text-white text-[10px] text-center py-1 z-10 rounded-t-xl">
                  Assista a aula anterior para desbloquear
                </div>
              )}

              <div className="relative flex-shrink-0 w-36 h-20 rounded-lg overflow-hidden">
                <img
                  src={getYoutubeThumbnail(a.videoUrl)}
                  alt={a.titulo}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg transform transition-transform duration-300 ease-out group-hover:scale-105"
                />
                {blocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg overflow-hidden">
                    <Lock size={18} className="text-white" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{a.titulo}</p>
                {a.descricao && (
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {a.descricao}
                  </p>
                )}
                {savedPct > 0 ? (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1">
                      <SimpleProgress value={savedPct} />
                    </div>
                    <span className="text-[11px] text-neutral-300 w-8 text-right">{savedPct}%</span>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-xs text-neutral-300 truncate">
                      {a.descricao || a.titulo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}