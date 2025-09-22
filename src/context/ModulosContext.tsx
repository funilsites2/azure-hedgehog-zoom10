import React, { createContext, useContext, useState, useEffect } from "react";

type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
  assistida?: boolean;
  bloqueado?: boolean;
};

type Modulo = {
  id: number;
  nome: string;
  capa: string;
  linha: string;
  aulas: Aula[];
  bloqueado?: boolean;
};

type ModulosContextType = {
  modulos: Modulo[];
  adicionarModulo: (
    nome: string,
    capa: string,
    aulas?: Omit<Aula, "id" | "assistida" | "bloqueado">[],
    linha?: string
  ) => void;
  adicionarAula: (moduloId: number, titulo: string, videoUrl: string) => void;
  marcarAulaAssistida: (moduloId: number, aulaId: number) => void;
  editarModulo: (
    moduloId: number,
    novoNome: string,
    novaCapa: string,
    novasAulas: Omit<Aula, "id" | "assistida" | "bloqueado">[],
    linha?: string
  ) => void;
  setModuloBloqueado: (moduloId: number, bloqueado: boolean) => void;
  setAulaBloqueada: (
    moduloId: number,
    aulaId: number,
    bloqueado: boolean
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
  // Módulos de exemplo iniciais
  return [
    {
      id: 1,
      nome: "Módulo 1",
      capa: "https://placehold.co/400x200/222/fff?text=Módulo+1",
      linha: "Linha A",
      bloqueado: false,
      aulas: [
        {
          id: 1,
          titulo: "Aula 1",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          assistida: true,
          bloqueado: false,
        },
        {
          id: 2,
          titulo: "Aula 2",
          videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
          assistida: false,
          bloqueado: false,
        },
      ],
    },
    {
      id: 2,
      nome: "Módulo 2",
      capa: "https://placehold.co/400x200/333/fff?text=Módulo+2",
      linha: "Linha B",
      bloqueado: false,
      aulas: [
        {
          id: 3,
          titulo: "Aula 1",
          videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
          assistida: false,
          bloqueado: false,
        },
      ],
    },
  ];
};

const ModulosContext = createContext<ModulosContextType | undefined>(
  undefined
);

export const ModulosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modulos, setModulos] = useState<Modulo[]>(getInitialModulos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modulos));
  }, [modulos]);

  const adicionarModulo = (
    nome: string,
    capa: string,
    aulas: Omit<Aula, "id" | "assistida" | "bloqueado">[] = [],
    linha: string = ""
  ) => {
    const novoId = Date.now();
    setModulos((prev) => [
      ...prev,
      {
        id: novoId,
        nome,
        capa,
        linha,
        bloqueado: false,
        aulas: aulas.map((a, i) => ({
          id: novoId + i + 1,
          titulo: a.titulo,
          videoUrl: a.videoUrl,
          assistida: false,
          bloqueado: false,
        })),
      },
    ]);
  };

  const adicionarAula = (
    moduloId: number,
    titulo: string,
    videoUrl: string
  ) => {
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
                  bloqueado: false,
                },
              ],
            }
          : m
      )
    );
  };

  const marcarAulaAssistida = (moduloId: number, aulaId: number) => {
    setModulos((prev) =>
      prev.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId ? { ...a, assistida: true } : a
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
    novasAulas: Omit<Aula, "id" | "assistida" | "bloqueado">[] = [],
    linha: string = ""
  ) => {
    setModulos((prev) =>
      prev.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              nome: novoNome,
              capa: novaCapa,
              linha,
              aulas: novasAulas.map((a, idx) => ({
                id: m.aulas[idx]?.id ?? Date.now() + idx + 1,
                titulo: a.titulo,
                videoUrl: a.videoUrl,
                assistida: m.aulas[idx]?.assistida ?? false,
                bloqueado: m.aulas[idx]?.bloqueado ?? false,
              })),
            }
          : m
      )
    );
  };

  const setModuloBloqueado = (moduloId: number, bloqueado: boolean) => {
    setModulos((prev) =>
      prev.map((m) => (m.id === moduloId ? { ...m, bloqueado } : m))
    );
  };

  const setAulaBloqueada = (
    moduloId: number,
    aulaId: number,
    bloqueado: boolean
  ) => {
    setModulos((prev) =>
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