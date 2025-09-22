import React, { createContext, useContext, useState, useEffect } from "react";

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
  capa: string;
  linha: string;
  aulas: Aula[];
  bloqueado?: boolean;
  releaseDate?: number; // timestamp de liberação do módulo
};

type ModulosContextType = {
  modulos: Modulo[];
  adicionarModulo: (
    nome: string,
    capa: string,
    aulas?: Omit<Aula, "id" | "assistida" | "bloqueado" | "releaseDate">[],
    linha?: string,
    delayDays?: number
  ) => void;
  adicionarAula: (
    moduloId: number,
    titulo: string,
    videoUrl: string,
    delayDays?: number
  ) => void;
  marcarAulaAssistida: (moduloId: number, aulaId: number) => void;
  editarModulo: (
    moduloId: number,
    novoNome: string,
    novaCapa: string,
    novasAulas: Omit<Aula, "id" | "assistida" | "bloqueado" | "releaseDate">[],
    linha?: string,
    delayDays?: number
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
};

const STORAGE_KEY = "modulos_area_membros";

const getInitialModulos = (): Modulo[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {}
  }
  const now = Date.now();
  return [
    {
      id: 1,
      nome: "Módulo 1",
      capa: "https://placehold.co/400x200/222/fff?text=Módulo+1",
      linha: "Linha A",
      aulas: [
        {
          id: 1,
          titulo: "Aula 1",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          assistida: true,
          bloqueado: false,
          releaseDate: now,
        },
        {
          id: 2,
          titulo: "Aula 2",
          videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
          assistida: false,
          bloqueado: false,
          releaseDate: now,
        },
      ],
      releaseDate: now,
    },
    {
      id: 2,
      nome: "Módulo 2",
      capa: "https://placehold.co/400x200/333/fff?text=Módulo+2",
      linha: "Linha B",
      aulas: [
        {
          id: 3,
          titulo: "Aula 1",
          videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
          assistida: false,
          bloqueado: false,
          releaseDate: now,
        },
      ],
      releaseDate: now,
    },
  ];
};

const initializeBlocks = (mods: Modulo[]): Modulo[] => {
  const now = Date.now();
  return mods.map((m) => {
    const moduleBlocked = m.bloqueado ?? (m.releaseDate ? now < m.releaseDate : false);
    const aulas = m.aulas.map((a, i, arr) => {
      if (a.bloqueado) {
        return a;
      }
      if (a.releaseDate && now < a.releaseDate) {
        return { ...a, bloqueado: true };
      }
      if (i === 0) {
        return { ...a, bloqueado: false };
      }
      const prev = arr[i - 1];
      return { ...a, bloqueado: !prev.assistida };
    });
    return { ...m, bloqueado: moduleBlocked, aulas };
  });
};

const ModulosContext = createContext<ModulosContextType | undefined>(undefined);

export const ModulosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modulos, setModulos] = useState<Modulo[]>(() =>
    initializeBlocks(getInitialModulos())
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modulos));
  }, [modulos]);

  const adicionarModulo = (
    nome: string,
    capa: string,
    aulas: Omit<Aula, "id" | "assistida" | "bloqueado" | "releaseDate">[] = [],
    linha: string = "",
    delayDays: number = 0
  ) => {
    const now = Date.now();
    const releaseDate = now + delayDays * 24 * 60 * 60 * 1000;
    const novoId = now;
    setModulos((prev) =>
      initializeBlocks([
        ...prev,
        {
          id: novoId,
          nome,
          capa,
          linha,
          aulas: aulas.map((a, i) => ({
            id: novoId + i + 1,
            titulo: a.titulo,
            videoUrl: a.videoUrl,
            assistida: false,
            bloqueado: i !== 0,
            releaseDate: releaseDate,
          })),
          releaseDate,
        },
      ])
    );
  };

  const adicionarAula = (
    moduloId: number,
    titulo: string,
    videoUrl: string,
    delayDays: number = 0
  ) => {
    const now = Date.now();
    const releaseDate = now + delayDays * 24 * 60 * 60 * 1000;
    setModulos((prev) =>
      prev.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: [
                ...m.aulas,
                {
                  id: Date.now(),
                  titulo,
                  videoUrl,
                  assistida: false,
                  bloqueado: true,
                  releaseDate,
                },
              ],
            }
          : m
      )
    );
  };

  const marcarAulaAssistida = (moduloId: number, aulaId: number) => {
    setModulos((prev) =>
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
    );
  };

  const editarModulo = (
    moduloId: number,
    novoNome: string,
    novaCapa: string,
    novasAulas: Omit<Aula, "id" | "assistida" | "bloqueado" | "releaseDate">[] = [],
    linha: string = "",
    delayDays: number = 0
  ) => {
    const now = Date.now();
    const releaseDate = now + delayDays * 24 * 60 * 60 * 1000;
    setModulos((prev) =>
      initializeBlocks(
        prev.map((m) =>
          m.id === moduloId
            ? {
                ...m,
                nome: novoNome,
                capa: novaCapa,
                linha,
                releaseDate,
                aulas: novasAulas.map((a, idx) => ({
                  id: m.aulas[idx]?.id ?? now + idx + 1,
                  titulo: a.titulo,
                  videoUrl: a.videoUrl,
                  assistida: m.aulas[idx]?.assistida ?? false,
                  bloqueado: false,
                  releaseDate,
                })),
              }
            : m
        )
      )
    );
  };

  const setModuloBloqueado = (moduloId: number, bloqueado: boolean) => {
    setModulos((prev) =>
      initializeBlocks(
        prev.map((m) => (m.id === moduloId ? { ...m, bloqueado } : m))
      )
    );
  };

  const setAulaBloqueada = (
    moduloId: number,
    aulaId: number,
    bloqueado: boolean
  ) => {
    setModulos((prev) =>
      initializeBlocks(
        prev.map((m) =>
          m.id === moduloId
            ? {
                ...m,
                aulas: m.aulas.map((a) =>
                  a.id === aulaId ? { ...a, bloqueado } : a
                ),
              }
            : m
        )
      )
    );
  };

  const setAulaReleaseDays = (
    moduloId: number,
    aulaId: number,
    delayDays: number
  ) => {
    const now = Date.now();
    const releaseDate = now + delayDays * 24 * 60 * 60 * 1000;
    setModulos((prev) =>
      initializeBlocks(
        prev.map((m) =>
          m.id === moduloId
            ? {
                ...m,
                aulas: m.aulas.map((a) =>
                  a.id === aulaId ? { ...a, releaseDate } : a
                ),
              }
            : m
        )
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
        editarModulo,
        setModuloBloqueado,
        setAulaBloqueada,
        setAulaReleaseDays,
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