import React, { createContext, useContext, useState } from "react";

type Aula = { id: number; titulo: string; videoUrl: string; assistida?: boolean };
type Modulo = { id: number; nome: string; capa: string; aulas: Aula[] };

type ModulosContextType = {
  modulos: Modulo[];
  adicionarModulo: (nome: string, capa: string, aulas?: Omit<Aula, "id" | "assistida">[]) => void;
  adicionarAula: (moduloId: number, titulo: string, videoUrl: string) => void;
  marcarAulaAssistida: (moduloId: number, aulaId: number) => void;
  editarModulo: (moduloId: number, novoNome: string, novaCapa: string, novasAulas: Omit<Aula, "id" | "assistida">[]) => void;
};

const ModulosContext = createContext<ModulosContextType | undefined>(undefined);

export const ModulosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modulos, setModulos] = useState<Modulo[]>([
    {
      id: 1,
      nome: "Módulo 1",
      capa: "https://placehold.co/400x200/222/fff?text=Módulo+1",
      aulas: [
        {
          id: 1,
          titulo: "Aula 1",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          assistida: true,
        },
        {
          id: 2,
          titulo: "Aula 2",
          videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
          assistida: false,
        },
      ],
    },
    {
      id: 2,
      nome: "Módulo 2",
      capa: "https://placehold.co/400x200/333/fff?text=Módulo+2",
      aulas: [
        {
          id: 3,
          titulo: "Aula 1",
          videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
          assistida: false,
        },
      ],
    },
  ]);

  const adicionarModulo = (nome: string, capa: string, aulas?: Omit<Aula, "id" | "assistida">[]) => {
    const novoModuloId = Date.now();
    setModulos((prev) => [
      ...prev,
      {
        id: novoModuloId,
        nome,
        capa,
        aulas: (aulas || []).map((aula) => ({
          ...aula,
          id: Date.now() + Math.random(),
          assistida: false,
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
                { id: Date.now() + Math.random(), titulo, videoUrl, assistida: false },
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

  const editarModulo = (moduloId: number, novoNome: string, novaCapa: string, novasAulas: Omit<Aula, "id" | "assistida">[]) => {
    setModulos((prev) =>
      prev.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              nome: novoNome,
              capa: novaCapa,
              aulas: novasAulas.map((aula, idx) => ({
                ...aula,
                id: m.aulas[idx]?.id || Date.now() + Math.random(),
                assistida: m.aulas[idx]?.assistida || false,
              })),
            }
          : m
      )
    );
  };

  return (
    <ModulosContext.Provider
      value={{ modulos, adicionarModulo, adicionarAula, marcarAulaAssistida, editarModulo }}
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