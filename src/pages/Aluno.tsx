import { useState } from "react";
import { Video, CheckCircle, Star, Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Aula = { id: number; titulo: string; assistida: boolean };
type Modulo = { id: number; nome: string; aulas: Aula[] };

const MODULOS_MOCK: Modulo[] = [
  {
    id: 1,
    nome: "Módulo 1",
    aulas: [
      { id: 1, titulo: "Aula 1", assistida: true },
      { id: 2, titulo: "Aula 2", assistida: false },
    ],
  },
  {
    id: 2,
    nome: "Módulo 2",
    aulas: [
      { id: 3, titulo: "Aula 1", assistida: false },
      { id: 4, titulo: "Aula 2", assistida: false },
    ],
  },
];

const Aluno = () => {
  const [modulos, setModulos] = useState<Modulo[]>(MODULOS_MOCK);

  // Cálculo de progresso
  const totalAulas = modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (acc, m) => acc + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas ? Math.round((aulasAssistidas / totalAulas) * 100) : 0;

  // Marcar aula como assistida
  const marcarAssistida = (moduloId: number, aulaId: number) => {
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
    <div className="min-h-screen bg-neutral-900 text-white flex">
      <aside className="w-64 bg-neutral-950 p-6 flex flex-col gap-6 border-r border-neutral-800">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Layers size={28} /> Aluno
        </h2>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Progresso Geral</h3>
          <Progress value={progresso} className="h-3 bg-neutral-800" />
          <div className="mt-2 text-sm">{progresso}% concluído</div>
        </div>
        <div className="mt-8">
          <h3 className="font-semibold mb-2 flex items-center gap-1">
            <Star className="text-yellow-400" size={18} /> Conquistas
          </h3>
          <ul className="text-sm">
            <li>
              {aulasAssistidas >= 1 ? (
                <CheckCircle className="inline text-green-400 mr-1" size={16} />
              ) : (
                <span className="inline-block w-4" />
              )}
              Primeira aula assistida
            </li>
            <li>
              {progresso === 100 ? (
                <CheckCircle className="inline text-green-400 mr-1" size={16} />
              ) : (
                <span className="inline-block w-4" />
              )}
              Curso completo!
            </li>
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Módulos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((modulo) => (
            <div key={modulo.id} className="bg-neutral-800 rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{modulo.nome}</h2>
              <ul>
                {modulo.aulas.map((aula) => (
                  <li
                    key={aula.id}
                    className={`flex items-center gap-2 mb-1 ${
                      aula.assistida ? "opacity-60 line-through" : ""
                    }`}
                  >
                    <Video size={18} />
                    {aula.titulo}
                    {!aula.assistida && (
                      <button
                        className="ml-auto text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                        onClick={() => marcarAssistida(modulo.id, aula.id)}
                      >
                        Marcar como assistida
                      </button>
                    )}
                    {aula.assistida && (
                      <CheckCircle className="text-green-400 ml-auto" size={16} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Aluno;