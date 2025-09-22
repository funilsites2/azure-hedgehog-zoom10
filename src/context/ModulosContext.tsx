import React, { createContext, useContext, useState, useEffect } from "react";

type Aula = { id: number; titulo: string; videoUrl: string; assistida?: boolean; bloqueado?: boolean };
type Modulo = { id: number; nome: string; capa: string; aulas: Aula[]; bloqueado?: boolean; coluna: number };

type ModulosContextType = {
  modulos: Modulo[];
  adicionarModulo: (
    nome: string,
    capa: string,
    aulas?: Omit<Aula, "id" | "assistida" | "bloqueado">[],
    coluna?: number
  ) => void;
  adicionarAula: (moduloId: number, titulo: string, videoUrl: string) => void;
  marcarAulaAssistida: (moduloId: number, aulaId: number) => void;
  editarModulo: (
    moduloId: number,
    novoNome: string,
    novaCapa: string,
    novasAulas: Omit<Aula, "id" | "assistida" | "bloqueado">[],
    coluna?: number
  ) => void;
  setModuloBloqueado: (moduloId: number, bloqueado: boolean) => void;
  setAulaBloqueada: (moduloId: number, aulaId: number, bloqueado: boolean) => void;
};

const STORAGE_KEY = "modulos_area_membros";

const getInitialModulos = (): Modulo[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {}
  }
  return [
    {
      id: 1,
      nome: "Módulo 1",
      capa: "https://placehold.co/400x200/222/fff?text=Módulo+1",
      bloqueado: false,
      coluna: 1,
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
      bloqueado: false,
      coluna: 2,
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

const ModulosContext = createContext<ModulosContextType | undefined>(undefined);

export const ModulosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modulos, setModulos] = useState<Modulo[]>(getInitialModulos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modulos));
  }, [modulos]);

  const adicionarModulo = (
    nome: string,
    capa: string,
    aulas: Omit<Aula, "id" | "assistida" | "bloqueado">[] = [],
    coluna: number = 1
  ) => {
    const novoModuloId = Date.now();
    setModulos((prev) => [
      ...prev,
      {
        id: novoModuloId,
        nome,
        capa,
        coluna,
        bloqueado: false,
        aulas: aulas.map((aula) => ({
          ...aula,
          id: Date.now() + Math.random(),
          assistida: false,
          bloqueado: false,
        })),
      },
    ]);
  };

  const adicionarAula = (moduloId: number, titulo: string, videoUrl: string) => {
    setModulos((prev) =>
      prev.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: [
                ...m.aulas,
                { id: Date.now() + Math.random(), titulo, videoUrl, assistida: false, bloqueado: false },
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
              aulas: m.aulas.map((a) => (a.id === aulaId ? { ...a, assistida: true } : a)),
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
    coluna: number = 1
  ) => {
    setModulos((prev) =>
      prev.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              nome: novoNome,
              capa: novaCapa,
              coluna,
              aulas: novasAulas.map((aula, idx) => ({
                ...aula,
                id: m.aulas[idx]?.id || Date.now() + Math.random(),
                assistida: m.aulas[idx]?.assistida || false,
                bloqueado: m.aulas[idx]?.bloqueado || false,
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

  const setAulaBloqueada = (moduloId: number, aulaId: number, bloqueado: boolean) => {
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