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

  // Video progress percent (0 - 100)
  const [videoProgress, setVideoProgress] = useState<number>(0);

  // refs for player
  const playerRef = useRef<any | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const lastSavedTimeRef = useRef<number>(0);
  const lastSavedPctRef = useRef<number>(0);

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

  // Start a 5s timer when the aula is shown; if it completes, mark aula as started
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

  // Manage video progress tracking (YouTube IFrame API if possible, otherwise try <video> - fallback)
  useEffect(() => {
    // reset progress when switching aulas
    setVideoProgress(0);
    lastSavedTimeRef.current = 0;
    lastSavedPctRef.current = 0;

    // Clear existing player/poll
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
      // load YouTube api if needed
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
            // sometimes YT global isn't ready immediately; wait a tick
            setTimeout(() => resolve(), 50);
          };
          document.body.appendChild(tag);
        });

      let mounted = true;

      ensureYouTubeAPI().then(() => {
        if (!mounted) return;
        const YT = (window as any).YT;
        // create player
        try {
          playerRef.current = new YT.Player(playerContainerRef.current, {
            videoId: ytId,
            playerVars: {
              modestbranding: 1,
              rel: 0,
              origin: window.location.origin,
              enablejsapi: 1,
            },
            events: {
              onReady: (event: any) => {
                // Try to resume from saved time (if exists)
                try {
                  const saved = parseFloat(localStorage.getItem(timeKey(aula.id)) || "0");
                  if (saved && !isNaN(saved) && saved > 0) {
                    // seek to saved position (slightly offset to avoid instant re-trigger)
                    event.target.seekTo(saved, true);
                  }
                } catch {
                  // ignore storage issues
                }

                // start polling current time/duration
                if (pollIntervalRef.current) {
                  window.clearInterval(pollIntervalRef.current);
                  pollIntervalRef.current = null;
                }
                pollIntervalRef.current = window.setInterval(() => {
                  try {
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

                    // Persist progress/time but throttle saves to every ~2s change or when pct changes >=1%
                    const lastSaved = lastSavedTimeRef.current || 0;
                    const lastPct = lastSavedPctRef.current || 0;
                    if (Math.abs(cur - lastSaved) > 2 || Math.abs(pct - lastPct) >= 1) {
                      lastSavedTimeRef.current = cur;
                      lastSavedPctRef.current = pct;
                      try {
                        localStorage.setItem(timeKey(aula.id), String(cur));
                        localStorage.setItem(pctKey(aula.id), String(pct));
                      } catch {
                        // ignore storage errors
                      }
                    }
                  } catch {
                    // ignore polling errors
                  }
                }, 500) as unknown as number;
              },
            },
          });
        } catch {
          // fallback: do nothing, keep progress at 0
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
      // Not a YouTube video: if it's a direct video src we could render <video>, but we must not change markup broadly.
      // Keep fallback: no access to progress for cross-origin iframe; leave at 0.
      return () => {
        if (pollIntervalRef.current) {
          window.clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aula.id, aula.videoUrl]);

  // When aula is marked assistida set progress to 100 and clear saved progress
  useEffect(() => {
    if (aula.assistida) {
      setVideoProgress(100);
      try {
        localStorage.removeItem(timeKey(aula.id));
        localStorage.removeItem(pctKey(aula.id));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aula.assistida]);

  // Decide which percent to show: if the current aula is playable and we have a videoProgress > 0 (or started), show videoProgress,
  // otherwise fall back to module progress.
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
              onClick={() => onMarcarAssistida(aula.id)}
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
              {/* Mostrar sempre o progresso do módulo aqui */}
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
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg flex items-stretch">
            {/* If it's a YouTube video we render the player container so the YT API can control it; otherwise keep iframe */}
            {getYoutubeId(aula.videoUrl) ? (
              <div ref={playerContainerRef} className="w-full h-full" />
            ) : (
              <iframe
                src={aula.videoUrl}
                title={aula.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      <div className="w-full md:w-1/3 overflow-auto space-y-4 pr-4">
        {aulas.map((a) => {
          const blockedByDate = a.releaseDate ? now < a.releaseDate : false;
          const blockedSequential = a.bloqueado === true && !blockedByDate;
          const blocked = blockedByDate || blockedSequential;

          // read saved percent for UI cards (fallback 0)
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
                "group relative rounded-xl overflow-hidden cursor-pointer",
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
                // default slightly zoomed-in (scale-110) then smoothly zooms out to scale-100 on hover
                className="w-full h-20 object-cover rounded-xl transform transition-transform duration-300 ease-out scale-110 group-hover:scale-100"
              />
              {blocked && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Lock size={24} className="text-white" />
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm text-white px-1 truncate">{a.titulo}</p>
                {/* show per-aula saved progress */}
                {savedPct > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1">
                      <SimpleProgress value={savedPct} />
                    </div>
                    <span className="text-xs text-neutral-300 w-10 text-right">{savedPct}%</span>
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