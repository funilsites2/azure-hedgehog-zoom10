import { useState } from "react";
import { Video, CheckCircle, Star, Layers, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Aula = { id: number; titulo: string; videoUrl: string; assistida: boolean };
type Modulo = { id: number; nome: string; capa: string; aulas: Aula[] };

// Mock inicial para demonstração
const MODULOS_MOCK: Modulo[] = [
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
];

const Aluno = () => {
  const [modulos, setModulos] = useState<Modulo[]>(MODULOS_MOCK);
  const [moduloSelecionado, setModuloSelecionado] = useState<Modulo | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<Aula | null>(null);

  // Progresso geral
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
    if (moduloSelecionado) {
      setModuloSelecionado((m) =>
        m
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId ? { ...a, assistida: true } : a
              ),
            }
          : m
      );
    }
    if (aulaSelecionada && aulaSelecionada.id === aulaId) {
      setAulaSelecionada((a) => a ? { ...a, assistida: true } : a);
    }
  };

  // Quando selecionar um módulo, selecionar a primeira aula por padrão
  const handleSelecionarModulo = (modulo: Modulo) => {
    setModuloSelecionado(modulo);
    setAulaSelecionada(modulo.aulas[0] || null);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex">
      <aside className="w-72 bg-neutral-950 p-6 flex flex-col gap-6 border-r border-neutral-800">
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
        {!moduloSelecionado ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Módulos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {modulos.map((modulo) => (
                <div
                  key={modulo.id}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg bg-neutral-800 hover:scale-105 transition-transform"
                  onClick={() => handleSelecionarModulo(modulo)}
                >
                  <img
                    src={modulo.capa}
                    alt={modulo.nome}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-xl font-bold">{modulo.nome}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded text-xs">
                    {modulo.aulas.length} aula{modulo.aulas.length !== 1 && "s"}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white transition"
              onClick={() => {
                setModuloSelecionado(null);
                setAulaSelecionada(null);
              }}
            >
              <ArrowLeft size={20} /> Voltar para módulos
            </button>
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <img
                src={moduloSelecionado.capa}
                alt={moduloSelecionado.nome}
                className="w-16 h-16 object-cover rounded"
              />
              {moduloSelecionado.nome}
            </h1>
            {aulaSelecionada && (
              <div className="mb-8">
                <div className="mb-2 font-semibold flex items-center gap-2 text-lg">
                  <Video size={24} /> {aulaSelecionada.titulo}
                </div>
                <div className="aspect-video mb-3 rounded overflow-hidden bg-black shadow-lg">
                  <iframe
                    src={aulaSelecionada.videoUrl}
                    title={aulaSelecionada.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {!aulaSelecionada.assistida ? (
                  <button
                    className="mt-2 text-xs bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => marcarAssistida(moduloSelecionado.id, aulaSelecionada.id)}
                  >
                    Marcar como assistida
                  </button>
                ) : (
                  <div className="mt-2 flex items-center gap-1 text-green-400 text-xs">
                    <CheckCircle size={16} /> Aula assistida
                  </div>
                )}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold mb-4">Aulas do módulo</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {moduloSelecionado.aulas.map((aula) => (
                  <div
                    key={aula.id}
                    className={`min-w-[220px] max-w-[220px] bg-neutral-800 rounded-lg shadow-md cursor-pointer border-2 transition-all flex-shrink-0 ${
                      aulaSelecionada && aula.id === aulaSelecionada.id
                        ? "border-green-500 scale-105"
                        : "border-transparent hover:border-green-700"
                    }`}
                    onClick={() => setAulaSelecionada(aula)}
                  >
                    <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                      <iframe
                        src={aula.videoUrl}
                        title={aula.titulo}
                        className="w-full h-full pointer-events-none"
                        tabIndex={-1}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-3 flex items-center gap-2">
                      <Video size={18} />
                      <span className="truncate">{aula.titulo}</span>
                      {aula.assistida && (
                        <CheckCircle className="text-green-400 ml-auto" size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Aluno;