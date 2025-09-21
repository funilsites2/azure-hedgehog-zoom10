import { useState } from "react";
import { Plus, Video, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

type Aula = { id: number; titulo: string };
type Modulo = { id: number; nome: string; aulas: Aula[] };

const Admin = () => {
  const [modulos, setModulos] = useState<Modulo[]>([
    { id: 1, nome: "Módulo 1", aulas: [{ id: 1, titulo: "Aula 1" }] },
  ]);
  const [novoModulo, setNovoModulo] = useState("");
  const [novaAula, setNovaAula] = useState<{ moduloId: number; titulo: string }>({ moduloId: 1, titulo: "" });

  const adicionarModulo = () => {
    if (!novoModulo.trim()) return;
    setModulos([...modulos, { id: Date.now(), nome: novoModulo, aulas: [] }]);
    setNovoModulo("");
  };

  const adicionarAula = () => {
    if (!novaAula.titulo.trim()) return;
    setModulos(
      modulos.map((m) =>
        m.id === novaAula.moduloId
          ? { ...m, aulas: [...m.aulas, { id: Date.now(), titulo: novaAula.titulo }] }
          : m
      )
    );
    setNovaAula({ moduloId: novaAula.moduloId, titulo: "" });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex">
      <aside className="w-64 bg-neutral-950 p-6 flex flex-col gap-6 border-r border-neutral-800">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Layers size={28} /> Admin
        </h2>
        <div>
          <h3 className="font-semibold mb-2">Adicionar Módulo</h3>
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="Nome do módulo"
            value={novoModulo}
            onChange={(e) => setNovoModulo(e.target.value)}
          />
          <Button className="w-full" onClick={adicionarModulo}>
            <Plus className="mr-2" size={16} /> Adicionar
          </Button>
        </div>
        <div>
          <h3 className="font-semibold mb-2 mt-6">Adicionar Aula</h3>
          <select
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            value={novaAula.moduloId}
            onChange={(e) => setNovaAula({ ...novaAula, moduloId: Number(e.target.value) })}
          >
            {modulos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="Título da aula"
            value={novaAula.titulo}
            onChange={(e) => setNovaAula({ ...novaAula, titulo: e.target.value })}
          />
          <Button className="w-full" onClick={adicionarAula}>
            <Video className="mr-2" size={16} /> Adicionar Aula
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Módulos e Aulas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((modulo) => (
            <div key={modulo.id} className="bg-neutral-800 rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{modulo.nome}</h2>
              <ul>
                {modulo.aulas.map((aula) => (
                  <li key={aula.id} className="flex items-center gap-2 mb-1">
                    <Video size={18} /> {aula.titulo}
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

export default Admin;