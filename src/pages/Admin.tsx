import { useState } from "react";
import { Plus, Video, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModulos } from "@/context/ModulosContext";

const Admin = () => {
  const { modulos, adicionarModulo, adicionarAula } = useModulos();
  const [novoModulo, setNovoModulo] = useState({ nome: "", capa: "" });
  const [novaAula, setNovaAula] = useState<{ moduloId: number | ""; titulo: string; videoUrl: string }>({
    moduloId: "",
    titulo: "",
    videoUrl: "",
  });

  const handleAdicionarModulo = () => {
    if (!novoModulo.nome.trim() || !novoModulo.capa.trim()) return;
    adicionarModulo(novoModulo.nome, novoModulo.capa);
    setNovoModulo({ nome: "", capa: "" });
  };

  const handleAdicionarAula = () => {
    if (
      !novaAula.titulo.trim() ||
      !novaAula.videoUrl.trim() ||
      novaAula.moduloId === ""
    )
      return;
    adicionarAula(Number(novaAula.moduloId), novaAula.titulo, novaAula.videoUrl);
    setNovaAula({ moduloId: "", titulo: "", videoUrl: "" });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex">
      <aside className="w-72 bg-neutral-950 p-6 flex flex-col gap-8 border-r border-neutral-800">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Layers size={28} /> Admin
        </h2>
        <div>
          <h3 className="font-semibold mb-2">Novo Módulo</h3>
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="Nome do módulo"
            value={novoModulo.nome}
            onChange={(e) => setNovoModulo((m) => ({ ...m, nome: e.target.value }))}
          />
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="URL da capa (imagem)"
            value={novoModulo.capa}
            onChange={(e) => setNovoModulo((m) => ({ ...m, capa: e.target.value }))}
          />
          <Button className="w-full" onClick={handleAdicionarModulo}>
            <Plus className="mr-2" size={16} /> Adicionar Módulo
          </Button>
        </div>
        <div>
          <h3 className="font-semibold mb-2 mt-6">Nova Aula</h3>
          <select
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            value={novaAula.moduloId}
            onChange={(e) =>
              setNovaAula((a) => ({ ...a, moduloId: Number(e.target.value) }))
            }
          >
            <option value="">Selecione o módulo</option>
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
            onChange={(e) => setNovaAula((a) => ({ ...a, titulo: e.target.value }))}
          />
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="URL do vídeo (YouTube, Vimeo, etc)"
            value={novaAula.videoUrl}
            onChange={(e) => setNovaAula((a) => ({ ...a, videoUrl: e.target.value }))}
          />
          <Button className="w-full" onClick={handleAdicionarAula}>
            <Video className="mr-2" size={16} /> Adicionar Aula
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Módulos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((modulo) => (
            <div key={modulo.id} className="bg-neutral-800 rounded-lg p-4 shadow-lg">
              <div className="mb-2">
                <img
                  src={modulo.capa}
                  alt={modulo.nome}
                  className="w-full h-40 object-cover rounded mb-2"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/400x200?text=Sem+Capa")}
                />
                <h2 className="text-xl font-semibold">{modulo.nome}</h2>
              </div>
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