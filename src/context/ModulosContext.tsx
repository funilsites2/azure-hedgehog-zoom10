import React, { createContext, useContext, useState, useEffect } from "react";

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
    delayDays?: number
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
  duplicarModulo: (moduloId: number) => void;
};

const STORAGE_KEY = "modulos_area_membros";
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

const getInitialModulos = (): Modulo[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {}
  }
  // Seed inicial: offsets 0 (liberado no dia da matrícula)
  return [
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
};

// Ajusta bloqueios com base na matrícula + offset; migra dados antigos com releaseDate absoluto para offset.
const initializeBlocks = (mods: Modulo[]): Modulo[] => {
  const now = Date.now();
  const enrollment = getEnrollmentDate();

  return mods.map((m) => {
    // Migrar/normalizar offset do módulo
    let moduleOffset =
      typeof m.releaseOffsetDays === "number" && isFinite(m.releaseOffsetDays)
        ? Math.max(0, Math.round(m.releaseOffsetDays))
        : undefined;

    if (moduleOffset === undefined && m.releaseDate) {
      const diff = Math.max(0, Math.round((m.releaseDate - enrollment) / MS_DAY));
      moduleOffset = diff;
    }
    if (moduleOffset === undefined) moduleOffset = 0;

    const moduleEffectiveRelease = enrollment + moduleOffset * MS_DAY;
    const moduleBlocked =
      (m.bloqueado ?? false) || moduleEffectiveRelease > now;

    // Normaliza aulas
    const aulas = m.aulas.map((a, i, arr) => {
      let aulaOffset =
        typeof a.releaseOffsetDays === "number" && isFinite(a.releaseOffsetDays)
          ? Math.max(0, Math.round(a.releaseOffsetDays))
          : undefined;

      if (aulaOffset === undefined && a.releaseDate) {
        const diff = Math.max(0, Math.round((a.releaseDate - enrollment) / MS_DAY));
        aulaOffset = diff;
      }
      if (aulaOffset === undefined) {
        // fallback: herda offset do módulo
        aulaOffset = moduleOffset!;
      }

      const effectiveRelease = enrollment + aulaOffset * MS_DAY;
      const alreadyStarted = a.started ?? false;

      // Regra de bloqueio: por data OU sequencial
      if (effectiveRelease > now) {
        return {
          ...a,
          releaseOffsetDays: aulaOffset,
          releaseDate: effectiveRelease,
          bloqueado: true,
          started: alreadyStarted,
        };
      }

      if (i === 0) {
        return {
          ...a,
          releaseOffsetDays: aulaOffset,
          releaseDate: effectiveRelease,
          bloqueado: false,
          started: alreadyStarted,
        };
      }

      const prev = arr[i - 1];
      const prevAssistida = !!prev.assistida;
      return {
        ...a,
        releaseOffsetDays: aulaOffset,
        releaseDate: effectiveRelease,
        bloqueado: !prevAssistida,
        started: alreadyStarted,
      };
    });

    return {
      ...m,
      releaseOffsetDays: moduleOffset,
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
  const [modulos, setModulos] = useState<Modulo[]>(() =>
    initializeBlocks(getInitialModulos())
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modulos));
  }, [modulos]);

  const adicionarModulo = (
    nome: string,
    capa: string,
    aulas: Omit<
      Aula,
      "id" | "assistida" | "bloqueado" | "releaseDate" | "releaseOffsetDays" | "started"
    >[] = [],
    linha: string = "",
    delayDays: number = 0
  ) => {
    const now = Date.now();
    setModulos((prev) =>
      initializeBlocks([
        ...prev,
        {
          id: now,
          nome,
          capa,
          linha,
          releaseOffsetDays: Math.max(0, Math.round(delayDays)),
          aulas: aulas.map((a, i) => ({
            id: now + i + 1,
            titulo: a.titulo,
            videoUrl: a.videoUrl,
            descricao: a.descricao,
            assistida: false,
            bloqueado: i !== 0, // sequencial
            releaseOffsetDays: Math.max(0, Math.round(delayDays)),
            started: false,
          })),
        },
      ])
    );
  };

  const adicionarAula = (
    moduloId: number,
    titulo: string,
    videoUrl: string,
    delayDays: number = 0,
    descricao: string = ""
  ) => {
    const now = Date.now();
    setModulos((prev) =>
      initializeBlocks(
        prev.map((m) =>
          m.id === moduloId
            ? {
                ...m,
                aulas: [
                  ...m.aulas,
                  {
                    id: now,
                    titulo,
                    videoUrl,
                    descricao,
                    assistida: false,
                    bloqueado: true, // só desbloqueia quando chegar a vez + data
                    releaseOffsetDays: Math.max(0, Math.round(delayDays)),
                    started: false,
                  },
                ],
              }
            : m
        )
      )
    );
  };

  const marcarAulaAssistida = (moduloId: number, aulaId: number) => {
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

  const marcarAulaIniciada = (moduloId: number, aulaId: number) => {
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

  const editarModulo = (
    moduloId: number,
    novoNome: string,
    novaCapa: string,
    novasAulas: Omit<
      Aula,
      "id" | "assistida" | "bloqueado" | "releaseDate" | "releaseOffsetDays" | "started"
    >[] = [],
    linha: string = "",
    delayDays: number = 0
  ) => {
    const now = Date.now();
    const offset = Math.max(0, Math.round(delayDays));
    setModulos((prev) =>
      initializeBlocks(
        prev.map((m) => {
          if (m.id !== moduloId) return m;

          const aulasAtualizadas: Aula[] =
            novasAulas && novasAulas.length > 0
              ? novasAulas.map((a, idx) => ({
                  id: m.aulas[idx]?.id ?? now + idx + 1,
                  titulo: a.titulo,
                  videoUrl: a.videoUrl,
                  descricao: a.descricao ?? m.aulas[idx]?.descricao,
                  assistida: m.aulas[idx]?.assistida ?? false,
                  bloqueado: false,
                  releaseOffsetDays: offset,
                  started: m.aulas[idx]?.started ?? false,
                }))
              : m.aulas.map((aExistente) => ({
                  ...aExistente,
                  releaseOffsetDays: offset,
                }));

          return {
            ...m,
            nome: novoNome,
            capa: novaCapa,
            linha,
            releaseOffsetDays: offset,
            aulas: aulasAtualizadas,
          };
        })
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
    const offset = Math.max(0, Math.round(delayDays));
    setModulos((prev) =>
      initializeBlocks(
        prev.map((m) =>
          m.id === moduloId
            ? {
                ...m,
                aulas: m.aulas.map((a) =>
                  a.id === aulaId ? { ...a, releaseOffsetDays: offset } : a
                ),
              }
            : m
        )
      )
    );
  };

  const duplicarModulo = (moduloId: number) => {
    const original = modulos.find((m) => m.id === moduloId);
    if (!original) return;
    const now = Date.now();
    const clonedAulas = original.aulas.map((a, idx) => ({
      ...a,
      id: now + idx + 1,
      assistida: false,
      started: false,
      // mantém offset para cada aula
      releaseOffsetDays: a.releaseOffsetDays,
    }));
    const cloned: Modulo = {
      ...original,
      id: now + 1,
      nome: `${original.nome} (Cópia)`,
      aulas: clonedAulas,
      releaseOffsetDays: original.releaseOffsetDays,
    };
    setModulos((prev) => initializeBlocks([...prev, cloned]));
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