"use client";

import React from "react";
import { Flag, Compass, BookOpen, Target, Star, Trophy, CheckCircle } from "lucide-react";
import SimpleProgress from "@/components/SimpleProgress";

type GamificationMapProps = {
  progresso: number; // 0-100
  totalAulas: number;
  aulasAssistidas: number;
};

type Stage = {
  label: string;
  pct: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const stages: Stage[] = [
  { label: "Início", pct: 0, icon: Flag },
  { label: "Explorador", pct: 20, icon: Compass },
  { label: "Aprendiz", pct: 40, icon: BookOpen },
  { label: "Avançado", pct: 60, icon: Target },
  { label: "Expert", pct: 80, icon: Star },
  { label: "Mestre", pct: 100, icon: Trophy },
];

function clampPct(v: number) {
  if (!isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

export default function GamificationMap({
  progresso,
  totalAulas,
  aulasAssistidas,
}: GamificationMapProps) {
  const pct = clampPct(progresso);
  const activeIndex = stages.reduce((acc, s, i) => (pct >= s.pct ? i : acc), 0);
  const nextStage = stages[activeIndex + 1];

  const aulasParaProximaEtapa = (() => {
    if (!nextStage) return 0;
    if (totalAulas <= 0) return 0;
    const aulasAlvo = Math.ceil((nextStage.pct / 100) * totalAulas);
    return Math.max(0, aulasAlvo - aulasAssistidas);
  })();

  const aulasParaConcluir = Math.max(0, totalAulas - aulasAssistidas);

  return (
    <div className="space-y-6">
      {/* Cabeçalho e resumo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Mapa de Progresso</h3>
          <p className="text-sm text-neutral-300">
            Você está na etapa:{" "}
            <span className="font-medium text-white">
              {stages[activeIndex]?.label}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-48">
            <SimpleProgress value={pct} />
          </div>
          <span className="text-sm text-neutral-300">{pct}%</span>
        </div>
      </div>

      {/* Trilha com etapas (scrollável no mobile) */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[680px] md:min-w-0">
          <div className="relative mt-8 mb-10">
            {/* Linha base */}
            <div className="h-2 rounded-full bg-neutral-800" />
            {/* Linha preenchida */}
            <div
              className="absolute top-0 left-0 h-2 rounded-full bg-green-600"
              style={{ width: `${pct}%` }}
            />
            {/* Marcadores */}
            <div className="absolute inset-0 flex justify-between items-center">
              {stages.map((s, i) => {
                const reached = pct >= s.pct;
                const current = i === activeIndex;
                const Icon = s.icon;
                return (
                  <div key={s.pct} className="relative flex flex-col items-center">
                    <div
                      className={[
                        "flex items-center justify-center w-12 h-12 rounded-full border-2 transition",
                        reached
                          ? "bg-green-600 border-green-400 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]"
                          : current
                          ? "bg-neutral-900 border-green-500"
                          : "bg-neutral-900 border-neutral-700",
                      ].join(" ")}
                      title={`${s.label} (${s.pct}%)`}
                    >
                      {reached ? (
                        <CheckCircle size={22} className="text-white" />
                      ) : (
                        <Icon size={22} className={current ? "text-green-400" : "text-neutral-400"} />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-xs font-medium">{s.label}</div>
                      <div className="text-[10px] text-neutral-400">{s.pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Próxima etapa e conclusão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-800/60 rounded-lg p-4">
          <h4 className="font-semibold mb-1">Próxima Etapa</h4>
          {nextStage ? (
            <>
              <p className="text-sm text-neutral-300">
                Alcance <span className="text-white font-medium">{nextStage.pct}%</span> para se tornar{" "}
                <span className="text-white font-medium">{nextStage.label}</span>.
              </p>
              <p className="text-sm text-neutral-300 mt-1">
                Faltam{" "}
                <span className="text-white font-semibold">{aulasParaProximaEtapa}</span>{" "}
                {aulasParaProximaEtapa === 1 ? "aula" : "aulas"} para a próxima etapa.
              </p>
            </>
          ) : (
            <p className="text-sm text-neutral-300">Você já atingiu a última etapa. Parabéns!</p>
          )}
        </div>
        <div className="bg-neutral-800/60 rounded-lg p-4">
          <h4 className="font-semibold mb-1">Conclusão do Curso</h4>
          {pct >= 100 ? (
            <p className="text-sm text-green-400">Curso concluído! Você é um Mestre!</p>
          ) : (
            <>
              <p className="text-sm text-neutral-300">
                Restam{" "}
                <span className="text-white font-semibold">{aulasParaConcluir}</span>{" "}
                {aulasParaConcluir === 1 ? "aula" : "aulas"} para concluir o curso.
              </p>
              <div className="mt-2">
                <SimpleProgress value={pct} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}