import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
  assistida?: boolean;
  bloqueado?: boolean;
  releaseDate?: number; // calculado dinamicamente a partir da matrícula + offset
  releaseOffsetDays?: number; // dias após a matrícula
  started?: boolean;
  descricao?: string;
};

type Modulo = {
  id: number;
  nome: string;
  capa: string;
  linha: string;
  aulas: Aula[];
  bloqueado?: boolean;
  releaseDate?: number; // calculado dinamicamente a partir da matrícula + offset
  releaseOffsetDays?: number; // dias após a matrícula
  externalUrl?: string; // URL externa de compra (opcional)
  trailerUrl?: string; // URL do trailer (opcional)
};

type ModulosContextType = {
  modulos: Modulo[];
  adicionarModulo: (
    nome: string,
    capa: string,
    aulas?: Omit<
      Aula,
      "id" | "assistida" | "bloqueado" | "releaseDate" | "releaseOffsetDays" | "started"
    >[],
    linha?: string,
    delayDays?: number,
    externalUrl?: string,
    trailerUrl?: string
  ) => void;
  adicionarAula: (
    moduloId: number,
    titulo: string,
    videoUrl: string,
    delayDays?: number,
    descricao?: string
  ) => void;
  marcarAulaAssistida: (moduloId: number, aulaId: number) => void;
  marcarAulaIniciada: (moduloId: number, aulaId: number) => void;
  editarModulo: (
    moduloId: number,
    novoNome: string,
    novaCapa: string,
    novasAulas: Omit<
      Aula,
      "id" | "assistida" | "bloqueado" | "releaseDate" | "releaseOffsetDays" | "started"
    >[],
    linha?: string,
    delayDays?: number,
    externalUrl?: string,
    trailerUrl?: string
  ) => void;
  setModuloBloqueado: (moduloId: number, bloqueado: boolean) => void;
  setAulaBloqueada: (
    moduloId: number,
    aulaId: number,
    bloqueado: boolean
  ) => void;
  setAulaReleaseDays: (
    moduloId: number,
    aulaId: number,
    delayDays: number
  ) => void;
  duplicarModulo: (moduloId: number) => void;
};

const ENROLLMENT_KEY = "aluno_enrollment_date";
const MS_DAY = 24 * 60 * 60 * 1000;

function getEnrollmentDate(): number {
  try {
    const raw = localStorage.getItem(ENROLLMENT_KEY);
    if (!raw) {
      const now = Date.now();
      localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(now));
      return now;
    }
    const val = JSON.parse(raw);
    return typeof val === "number" && isFinite(val) ? val : Date.now();
  } catch {
    const now = Date.now();
    localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(now));
    return now;
  }
}

// Seed inicial para popular o DB vazio
const seedDefaults = (): Modulo[] => [
  {
    id: 1,
    nome: "Módulo 1",
    capa: "https://placehold.co/400x200/222/fff?text=Módulo+1",
    linha: "Linha A",
    releaseOffsetDays: 0,
    aulas: [
      {
        id: 1,
        titulo: "Aula 1",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        assistida: true,
        bloqueado: false,
        releaseOffsetDays: 0,
        started: false,
        descricao: "Introdução ao módulo 1 e visão geral.",
      },
      {
        id: 2,
        titulo: "Aula 2",
        videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
        assistida: false,
        bloqueado: false,
        releaseOffsetDays: 0,
        started: false,
        descricao: "Conceitos fundamentais para continuar.",
      },
    ],
  },
  {
    id: 2,
    nome: "Módulo 2",
    capa: "https://placehold.co/400x200/333/fff?text=Módulo+2",
    linha: "Linha B",
    releaseOffsetDays: 0,
    aulas: [
      {
        id: 3,
        titulo: "Aula 1",
        videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
        assistida: false,
        bloqueado: false,
        releaseOffsetDays: 0,
        started: false,
        descricao: "Iniciando o módulo 2 com práticas.",
      },
    ],
  },
];

// Recalcula bloqueios com base na matrícula + offset e dependência sequencial
const initializeBlocks = (mods: Modulo[]): Modulo[] => {
  const now = Date.now();
  const enrollment = getEnrollmentDate();

  return mods.map((m) => {
    const moduleOffset =
      typeof m.releaseOffsetDays === "number" && isFinite(m.releaseOffsetDays)
        ? Math.max(0, Math.round(m.releaseOffsetDays))
        : 0;

    const moduleEffectiveRelease = enrollment + moduleOffset * MS_DAY;
    const moduleBlocked = (m.bloqueado ?? false) || moduleEffectiveRelease > now;

    const aulas = (m.aulas ?? []).map((a, i, arr) => {
      const aulaOffset =
        typeof a.releaseOffsetDays === "number" && isFinite(a.releaseOffsetDays)
          ? Math.max(0, Math.round(a.releaseOffsetDays))
          : moduleOffset;

      const effectiveRelease = enrollment + aulaOffset * MS_DAY;

      if (effectiveRelease > now) {
        return {
          ...a,
          releaseOffsetDays: aulaOffset,
          releaseDate: effectiveRelease,
          bloqueado: true,
        };
      }

      if (i === 0) {
        return {
          ...a,
          releaseOffsetDays: aulaOffset,
          releaseDate: effectiveRelease,
          bloqueado: false,
        };
      }

      const prev = arr[i - 1];
      const prevAssistida = !!prev.assistida;
      return {
        ...a,
        releaseOffsetDays: aulaOffset,
        releaseDate: effectiveRelease,
        bloqueado: !prevAssistida || a.bloqueado === true,
      };
    });

    return {
      ...m,
      releaseDate: moduleEffectiveRelease,
      bloqueado: moduleBlocked,
      aulas,
    };
  });
};

const ModulosContext = createContext<ModulosContextType | undefined>(undefined);

export const ModulosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  async function fetchFromDB() {
    const { data, error } = await supabase
      .from("modules")
      .select(`
        id, nome, capa, linha, external_url, trailer_url, release_offset_days, bloqueado, order_index,
        lessons:lessons ( id, module_id, titulo, video_url, descricao, release_offset_days, bloqueado, order_index )
      `)
      .order("order_index", { ascending: true });

    if (error) throw error;

    const mapped: Modulo[] =
      (data ?? []).map((m: any) => ({
        id: Number(m.id),
        nome: m.nome,
        capa: m.capa,
        linha: m.linha ?? "",
        externalUrl: m.external_url ?? undefined,
        trailerUrl: m.trailer_url ?? undefined,
        releaseOffsetDays: m.release_offset_days ?? 0,
        bloqueado: m.bloqueado ?? false,
        aulas: (m.lessons ?? [])
          .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
          .map((a: any) => ({
            id: Number(a.id),
            titulo: a.titulo,
            videoUrl: a.video_url,
            descricao: a.descricao ?? "",
            releaseOffsetDays: a.release_offset_days ?? 0,
            bloqueado: a.bloqueado ?? false,
            assistida: false,
            started: false,
          })),
      })) ?? [];

    if (mapped.length === 0) {
      // Seeder
      const seed = seedDefaults();
      for (const m of seed) {
        await supabase.from("modules").insert({
          id: m.id,
          nome: m.nome,
          capa: m.capa,
          linha: m.linha,
          external_url: m.externalUrl ?? null,
          trailer_url: m.trailerUrl ?? null,
          release_offset_days: m.releaseOffsetDays ?? 0,
          bloqueado: m.bloqueado ?? false,
          order_index: 0,
        });
        for (let i = 0; i < m.aulas.length; i++) {
          const a = m.aulas[i];
          await supabase.from("lessons").insert({
            id: a.id,
            module_id: m.id,
            titulo: a.titulo,
            video_url: a.videoUrl,
            descricao: a.descricao ?? null,
            release_offset_days: a.releaseOffsetDays ?? 0,
            bloqueado: a.bloqueado ?? false,
            order_index: i,
          });
        }
      }
      return fetchFromDB();
    }

    setModulos(initializeBlocks(mapped));
  }

  useEffect(() => {
    fetchFromDB();

    // Realtime: escuta alterações em modules e lessons
    const ch = supabase
      .channel("modules_lessons_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "modules" },
        () => fetchFromDB()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lessons" },
        () => fetchFromDB()
      )
      .subscribe();

    channelRef.current = ch;
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  const adicionarModulo: ModulosContextType["adicionarModulo"] = (
    nome,
    capa,
    aulas = [],
    linha = "",
    delayDays = 0,
    externalUrl,
    trailerUrl
  ) => {
    const now = Date.now();
    const moduleId = now;

    const run = async () => {
      await supabase.from("modules").insert({
        id: moduleId,
        nome,
        capa,
        linha,
        external_url: externalUrl ?? null,
        trailer_url: trailerUrl ?? null,
        release_offset_days: Math.max(0, Math.round(delayDays)),
        bloqueado: false,
        order_index: 0,
      });

      for (let i = 0; i < aulas.length; i++) {
        const a = aulas[i];
        await supabase.from("lessons").insert({
          id: moduleId + i + 1,
          module_id: moduleId,
          titulo: a.titulo,
          video_url: a.videoUrl,
          descricao: a.descricao ?? null,
          release_offset_days: Math.max(0, Math.round(delayDays)),
          bloqueado: i !== 0, // sequencial
          order_index: i,
        });
      }

      await fetchFromDB();
    };
    void run();
  };

  const adicionarAula: ModulosContextType["adicionarAula"] = (
    moduloId,
    titulo,
    videoUrl,
    delayDays = 0,
    descricao = ""
  ) => {
    const now = Date.now();
    const run = async () => {
      const { count } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })
        .eq("module_id", moduloId);

      const orderIndex = count ?? 0;

      await supabase.from("lessons").insert({
        id: now,
        module_id: moduloId,
        titulo,
        video_url: videoUrl,
        descricao: descricao || null,
        release_offset_days: Math.max(0, Math.round(delayDays)),
        bloqueado: true,
        order_index: orderIndex,
      });
      await fetchFromDB();
    };
    void run();
  };

  const editarModulo: ModulosContextType["editarModulo"] = (
    moduloId,
    novoNome,
    novaCapa,
    novasAulas = [],
    linha = "",
    delayDays = 0,
    externalUrl,
    trailerUrl
  ) => {
    const run = async () => {
      await supabase
        .from("modules")
        .update({
          nome: novoNome,
          capa: novaCapa,
          linha,
          external_url: externalUrl ?? null,
          trailer_url: trailerUrl ?? null,
          release_offset_days: Math.max(0, Math.round(delayDays)),
        })
        .eq("id", moduloId);

      // Recria aulas conforme lista passada (mantendo ordem)
      await supabase.from("lessons").delete().eq("module_id", moduloId);

      for (let i = 0; i < novasAulas.length; i++) {
        const a = novasAulas[i];
        await supabase.from("lessons").insert({
          id: moduloId + i + 1,
          module_id: moduloId,
          titulo: a.titulo,
          video_url: a.videoUrl,
          descricao: a.descricao ?? null,
          release_offset_days: Math.max(0, Math.round(delayDays)),
          bloqueado: i !== 0,
          order_index: i,
        });
      }

      await fetchFromDB();
    };
    void run();
  };

  const setModuloBloqueado: ModulosContextType["setModuloBloqueado"] = (
    moduloId,
    bloqueado
  ) => {
    const run = async () => {
      await supabase.from("modules").update({ bloqueado }).eq("id", moduloId);
      await fetchFromDB();
    };
    void run();
  };

  const setAulaBloqueada: ModulosContextType["setAulaBloqueada"] = (
    moduloId,
    aulaId,
    bloqueado
  ) => {
    const run = async () => {
      await supabase
        .from("lessons")
        .update({ bloqueado })
        .eq("id", aulaId)
        .eq("module_id", moduloId);
      await fetchFromDB();
    };
    void run();
  };

  const setAulaReleaseDays: ModulosContextType["setAulaReleaseDays"] = (
    moduloId,
    aulaId,
    delayDays
  ) => {
    const run = async () => {
      await supabase
        .from("lessons")
        .update({ release_offset_days: Math.max(0, Math.round(delayDays)) })
        .eq("id", aulaId)
        .eq("module_id", moduloId);
      await fetchFromDB();
    };
    void run();
  };

  const duplicarModulo: ModulosContextType["duplicarModulo"] = (moduloId) => {
    const original = modulos.find((m) => m.id === moduloId);
    if (!original) return;

    const run = async () => {
      const now = Date.now();
      const newModuleId = now + 1;

      await supabase.from("modules").insert({
        id: newModuleId,
        nome: `${original.nome} (Cópia)`,
        capa: original.capa,
        linha: original.linha,
        external_url: original.externalUrl ?? null,
        trailer_url: original.trailerUrl ?? null,
        release_offset_days: original.releaseOffsetDays ?? 0,
        bloqueado: original.bloqueado ?? false,
        order_index: 0,
      });

      for (let i = 0; i < original.aulas.length; i++) {
        const a = original.aulas[i];
        await supabase.from("lessons").insert({
          id: now + i + 2,
          module_id: newModuleId,
          titulo: a.titulo,
          video_url: a.videoUrl,
          descricao: a.descricao ?? null,
          release_offset_days: a.releaseOffsetDays ?? 0,
          bloqueado: i !== 0,
          order_index: i,
        });
      }

      await fetchFromDB();
    };
    void run();
  };

  // Progresso do aluno continua local (por usuário)
  const marcarAulaAssistida: ModulosContextType["marcarAulaAssistida"] = (
    moduloId,
    aulaId
  ) => {
    setModulos((prev) =>
      initializeBlocks(
        prev.map((m) => {
          if (m.id !== moduloId) return m;
          const novasAulas = m.aulas.map((a, i, arr) => {
            if (a.id === aulaId) {
              return { ...a, assistida: true, bloqueado: false };
            }
            if (i > 0 && arr[i - 1].id === aulaId) {
              return { ...a, bloqueado: false };
            }
            return a;
          });
          return { ...m, aulas: novasAulas };
        })
      )
    );
  };

  const marcarAulaIniciada: ModulosContextType["marcarAulaIniciada"] = (
    moduloId,
    aulaId
  ) => {
    setModulos((prev) =>
      prev.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId ? { ...a, started: true } : a
              ),
            }
          : m
      )
    );
  };

  return (
    <ModulosContext.Provider
      value={{
        modulos,
        adicionarModulo,
        adicionarAula,
        marcarAulaAssistida,
        marcarAulaIniciada,
        editarModulo,
        setModuloBloqueado,
        setAulaBloqueada,
        setAulaReleaseDays,
        duplicarModulo,
      }}
    >
      {children}
    </ModulosContext.Provider>
  );
};

export const useModulos = () => {
  const ctx = useContext(ModulosContext);
  if (!ctx) throw new Error("useModulos deve ser usado dentro do ModulosProvider");
  return ctx;
};