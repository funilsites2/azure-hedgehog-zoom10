import React, { createContext, useContext, useState } from "react";

type Aula = { id: number; titulo: string; videoUrl: string; assistida?: boolean };
type Modulo = { id: number; nome: string; capa: string; aulas: Aula[] };

type ModulosContextType = {
  modulos: Modulo[];
  adicionarModulo: (nome: string, capa: string) => void;
  adicionarAula: (moduloId: number, titulo: string, videoUrl: string) => void;
  marcarAulaAssistida: (moduloId: number, aulaId: number) => void;
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

  const adicionarModulo = (nome: string, capa: string) => {
    setModulos((prev) => [
      ...prev,
      { id: Date.now(), nome, capa, aulas: [] },
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
                { id: Date.now(), titulo, videoUrl, assistida: false },
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

  return (
    <ModulosContext.Provider
      value={{ modulos, adicionarModulo, adicionarAula, marcarAulaAssistida }}
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