import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Modulo = {
  id: number;
  nome: string;
  capa: string;
  linha?: string | null;
  externalUrl?: string | null;
  releaseOffsetDays?: number | null;
  bloqueado?: boolean | null;
  orderIndex?: number | null;
};

type ModulosContextValue = {
  modulos: Modulo[];
  carregando: boolean;
  refresh: () => Promise<void>;
  reordenarModulos: (ordenacao: Modulo[] | number[]) => Promise<void>;
};

const ModulosContext = createContext<ModulosContextValue | undefined>(undefined);

async function fetchModules(): Promise<Modulo[]> {
  const { data, error } = await supabase
    .from("modules")
    .select(
      "id, nome, capa, linha, external_url, release_offset_days, bloqueado, order_index",
    )
    .order("order_index", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((m: any) => ({
    id: Number(m.id),
    nome: m.nome,
    capa: m.capa,
    linha: m.linha ?? null,
    externalUrl: m.external_url ?? null,
    releaseOffsetDays: m.release_offset_days ?? 0,
    bloqueado: m.bloqueado ?? false,
    orderIndex: m.order_index ?? 0,
  }));
}

export function ModulosProvider({ children }: { children: React.ReactNode }) {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [carregando, setCarregando] = useState(true);

  const refresh = useMemo(
    () => async () => {
      setCarregando(true);
      const mods = await fetchModules();
      setModulos(mods);
      setCarregando(false);
    },
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const reordenarModulos: ModulosContextValue["reordenarModulos"] = async (ordenacao) => {
    const ids: number[] = Array.isArray(ordenacao) && typeof ordenacao[0] === "number"
      ? (ordenacao as number[])
      : (ordenacao as Modulo[]).map((m) => m.id);

    // Otimista: atualiza a ordem em memória
    setModulos((prev) => {
      const mapIndex = new Map<number, number>(ids.map((id, i) => [id, i]));
      const sorted = [...prev].sort((a, b) => {
        const ai = mapIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const bi = mapIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return ai - bi;
      });
      return sorted.map((m) => ({ ...m, orderIndex: mapIndex.get(m.id) ?? m.orderIndex }));
    });

    // Persiste no banco
    await Promise.all(
      ids.map((id, index) =>
        supabase.from("modules").update({ order_index: index }).eq("id", id),
      ),
    );

    // Recarrega para garantir consistência
    await refresh();
  };

  const value: ModulosContextValue = {
    modulos,
    carregando,
    refresh,
    reordenarModulos,
  };

  return <ModulosContext.Provider value={value}>{children}</ModulosContext.Provider>;
}

export function useModulos() {
  const ctx = useContext(ModulosContext);
  if (!ctx) {
    throw new Error("useModulos deve ser usado dentro do ModulosProvider");
  }
  return ctx;
}