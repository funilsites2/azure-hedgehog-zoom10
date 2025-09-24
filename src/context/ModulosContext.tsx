import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
  descricao?: string;
  assistida?: boolean;
  bloqueado?: boolean;
  releaseOffsetDays?: number;
  releaseDate?: number;
  started?: boolean;
  orderIndex?: number;
};

export type Modulo = {
  id: number;
  nome: string;
  capa: string;
  linha: string;
  aulas: Aula[];
  bloqueado?: boolean;
  releaseOffsetDays?: number;
  releaseDate?: number;
  externalUrl?: string;
  orderIndex?: number;
};

type ModulosContextType = {
  modulos: Modulo[];
  adicionarModulo: (
    nome: string,
    capa: string,
    aulas?: Pick<Aula, "titulo" | "videoUrl" | "descricao">[],
    linha?: string,
    delayDays?: number,
    externalUrl?: string
  ) => void;
  adicionarAula: (
    moduloId: number,
    titulo: string,
    videoUrl: string,
    delayDays?: number,
    descricao?: string
  ) => void;
  editarModulo: (
    moduloId: number,
    novoNome: string,
    novaCapa: string,
    novasAulas: Pick<Aula, "titulo" | "videoUrl" | "descricao">[],
    linha?: string,
    delayDays?: number,
    externalUrl?: string
  ) => void;
  duplicarModulo: (moduloId: number) => void;
  setModuloBloqueado: (moduloId: number, bloqueado: boolean) => void;
  setAulaReleaseDays: (moduloId: number, aulaId: number, delayDays: number) => void;
  reordenarModulos: (finalOrdered: Modulo[]) => void;
};

const ModulosContext = createContext<ModulosContextType | undefined>(undefined);

const MS_DAY = 24 * 60 * 60 * 1000;
const ENROLLMENT_KEY = "aluno_enrollment_date";

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

function initializeBlocks(mods: Modulo[]): Modulo[] {
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
}

export const ModulosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  async function fetchFromDB() {
    const { data, error } = await supabase
      .from("modules")
      .select(`
        id, nome, capa, linha, external_url, release_offset_days, bloqueado, order_index,
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
        releaseOffsetDays: m.release_offset_days ?? 0,
        bloqueado: m.bloqueado ?? false,
        orderIndex: m.order_index ?? 0,
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
            orderIndex: a.order_index ?? 0,
          })),
      })) ?? [];

    setModulos(initializeBlocks(mapped));
  }

  useEffect(() => {
    const run = async () => {
      await fetchFromDB();

      // Realtime para manter a UI atualizada
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
    };
    void run();

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
    externalUrl
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
        release_offset_days: Math.max(0, Math.round(delayDays)),
        bloqueado: false,
        order_index: moduleId, // provisório, estabilizado pela reordenação
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
          bloqueado: i !== 0, // sequencial simples
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
    externalUrl
  ) => {
    const run = async () => {
      await supabase
        .from("modules")
        .update({
          nome: novoNome,
          capa: novaCapa,
          linha,
          external_url: externalUrl ?? null,
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

  const setModuloBloqueado: ModulosContextType["setModuloBloqueado"] = (moduloId, bloqueado) => {
    const run = async () => {
      await supabase.from("modules").update({ bloqueado }).eq("id", moduloId);
      await fetchFromDB();
    };
    void run();
  };

  const setAulaReleaseDays: ModulosContextType["setAulaReleaseDays"] = (moduloId, aulaId, delayDays) => {
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
        release_offset_days: original.releaseOffsetDays ?? 0,
        bloqueado: original.bloqueado ?? false,
        order_index: now, // mantém ao final até ser reordenado
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

  const reordenarModulos: ModulosContextType["reordenarModulos"] = (finalOrdered) => {
    // Otimista no estado local
    setModulos((prev) => {
      const orderMap = new Map<number, number>(finalOrdered.map((m, i) => [m.id, i]));
      const sorted = [...prev].sort((a, b) => {
        const ai = orderMap.get(a.id);
        const bi = orderMap.get(b.id);
        return (ai ?? Number.MAX_SAFE_INTEGER) - (bi ?? Number.MAX_SAFE_INTEGER);
      });
      return sorted.map((m) => ({ ...m, orderIndex: orderMap.get(m.id) ?? m.orderIndex }));
    });

    // Persistência no BD
    const run = async () => {
      for (let i = 0; i < finalOrdered.length; i++) {
        const m = finalOrdered[i];
        await supabase.from("modules").update({ order_index: i }).eq("id", m.id);
      }
      await fetchFromDB();
    };
    void run();
  };

  return (
    <ModulosContext.Provider
      value={{
        modulos,
        adicionarModulo,
        adicionarAula,
        editarModulo,
        duplicarModulo,
        setModuloBloqueado,
        setAulaReleaseDays,
        reordenarModulos,
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