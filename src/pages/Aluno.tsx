import { useState } from "react";
import { Layers, ArrowLeft, Star, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";

const Aluno = () => {
  const { modulos, marcarAulaAssistida } = useModulos();
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);

  // Progresso geral
  const totalAulas = modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (acc, m) => acc + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas ? Math.round((aulasAssistidas / totalAulas) * 100) : 0;

  const modulo = modulos.find((m) => m.id === moduloSelecionado);

  return (
    <div className="min-h-screen h-screen w-screen flex bg-neutral-900 text-white overflow-hidden">
      <aside className="w-72 bg-neutral-950 p-6 flex flex-col gap-6 border-r border-neutral-800 h-full">
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
      <main className="flex-1 h-full flex flex-col overflow-hidden">
        {!modulo ? (
          <>
            <h1 className="text-3xl font-bold mb-6 mt-8 ml-8">Módulos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8">
              {modulos.map((modulo) => (
                <div
                  key={modulo.id}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg bg-neutral-800 hover:scale-105 transition-transform"
                  onClick={() => {
                    setModuloSelecionado(modulo.id);
                    setAulaSelecionada(modulo.aulas[0]?.id ?? null);
                  }}
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
              className="mb-6 mt-8 ml-8 flex items-center gap-2 text-neutral-400 hover:text-white transition"
              onClick={() => setModuloSelecionado(null)}
            >
              <ArrowLeft size={20} /> Voltar para módulos
            </button>
            <div className="flex-1 flex overflow-hidden">
              <AulaPlayer
                modulo={modulo}
                aulaSelecionadaId={aulaSelecionada ?? modulo.aulas[0]?.id}
                onSelecionarAula={setAulaSelecionada}
                onMarcarAssistida={(aulaId) => marcarAulaAssistida(modulo.id, aulaId)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Aluno;