import { useState } from "react";
import { Plus, Video, Layers, Trash2, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModulos } from "@/context/ModulosContext";
import { ModuloCarousel } from "@/components/ModuloCarousel";

const Admin = () => {
  const { modulos, adicionarModulo, adicionarAula, editarModulo } = useModulos();
  const [novoModulo, setNovoModulo] = useState({ nome: "", capa: "" });
  const [aulas, setAulas] = useState<{ titulo: string; videoUrl: string }[]>([]);
  const [novaAula, setNovaAula] = useState({ titulo: "", videoUrl: "" });

  const [novaAulaExistente, setNovaAulaExistente] = useState<{ moduloId: number | ""; titulo: string; videoUrl: string }>({
    moduloId: "",
    titulo: "",
    videoUrl: "",
  });

  // Edição de módulo
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editModulo, setEditModulo] = useState<{ nome: string; capa: string; aulas: { titulo: string; videoUrl: string }[] }>({
    nome: "",
    capa: "",
    aulas: [],
  });
  const [editAula, setEditAula] = useState({ titulo: "", videoUrl: "" });

  const handleAdicionarAulaAoNovoModulo = () => {
    if (!novaAula.titulo.trim() || !novaAula.videoUrl.trim()) return;
    setAulas((prev) => [...prev, { ...novaAula }]);
    setNovaAula({ titulo: "", videoUrl: "" });
  };

  const handleRemoverAulaDoNovoModulo = (idx: number) => {
    setAulas((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAdicionarModulo = () => {
    if (!novoModulo.nome.trim() || !novoModulo.capa.trim()) return;
    adicionarModulo(novoModulo.nome, novoModulo.capa, aulas);
    setNovoModulo({ nome: "", capa: "" });
    setAulas([]);
  };

  const handleAdicionarAulaExistente = () => {
    if (
      !novaAulaExistente.titulo.trim() ||
      !novaAulaExistente.videoUrl.trim() ||
      novaAulaExistente.moduloId === ""
    )
      return;
    adicionarAula(Number(novaAulaExistente.moduloId), novaAulaExistente.titulo, novaAulaExistente.videoUrl);
    setNovaAulaExistente({ moduloId: "", titulo: "", videoUrl: "" });
  };

  // Edição de módulo
  const iniciarEdicao = (moduloId: number) => {
    const modulo = modulos.find((m) => m.id === moduloId);
    if (!modulo) return;
    setEditandoId(moduloId);
    setEditModulo({
      nome: modulo.nome,
      capa: modulo.capa,
      aulas: modulo.aulas.map((a) => ({ titulo: a.titulo, videoUrl: a.videoUrl })),
    });
    setEditAula({ titulo: "", videoUrl: "" });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditModulo({ nome: "", capa: "", aulas: [] });
    setEditAula({ titulo: "", videoUrl: "" });
  };

  const salvarEdicao = () => {
    if (!editModulo.nome.trim() || !editModulo.capa.trim()) return;
    editarModulo(editandoId!, editModulo.nome, editModulo.capa, editModulo.aulas);
    cancelarEdicao();
  };

  const handleAdicionarAulaEdicao = () => {
    if (!editAula.titulo.trim() || !editAula.videoUrl.trim()) return;
    setEditModulo((prev) => ({
      ...prev,
      aulas: [...prev.aulas, { ...editAula }],
    }));
    setEditAula({ titulo: "", videoUrl: "" });
  };

  const handleRemoverAulaEdicao = (idx: number) => {
    setEditModulo((prev) => ({
      ...prev,
      aulas: prev.aulas.filter((_, i) => i !== idx),
    }));
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
          <div className="mb-2">
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 p-2 rounded bg-neutral-800 text-white"
                placeholder="Título da aula"
                value={novaAula.titulo}
                onChange={(e) => setNovaAula((a) => ({ ...a, titulo: e.target.value }))}
              />
              <input
                className="flex-1 p-2 rounded bg-neutral-800 text-white"
                placeholder="URL do vídeo"
                value={novaAula.videoUrl}
                onChange={(e) => setNovaAula((a) => ({ ...a, videoUrl: e.target.value }))}
              />
              <Button type="button" onClick={handleAdicionarAulaAoNovoModulo}>
                <Plus size={16} />
              </Button>
            </div>
            <ul className="mb-2">
              {aulas.map((aula, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm mb-1">
                  <Video size={16} /> {aula.titulo}
                  <button
                    className="ml-2 text-red-400 hover:text-red-600"
                    onClick={() => handleRemoverAulaDoNovoModulo(idx)}
                    title="Remover aula"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <Button className="w-full" onClick={handleAdicionarModulo}>
            <Plus className="mr-2" size={16} /> Adicionar Módulo
          </Button>
        </div>
        <div>
          <h3 className="font-semibold mb-2 mt-6">Nova Aula em Módulo Existente</h3>
          <select
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            value={novaAulaExistente.moduloId}
            onChange={(e) =>
              setNovaAulaExistente((a) => ({ ...a, moduloId: Number(e.target.value) }))
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
            value={novaAulaExistente.titulo}
            onChange={(e) => setNovaAulaExistente((a) => ({ ...a, titulo: e.target.value }))}
          />
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="URL do vídeo (YouTube, Vimeo, etc)"
            value={novaAulaExistente.videoUrl}
            onChange={(e) => setNovaAulaExistente((a) => ({ ...a, videoUrl: e.target.value }))}
          />
          <Button className="w-full" onClick={handleAdicionarAulaExistente}>
            <Video className="mr-2" size={16} /> Adicionar Aula
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Módulos</h1>
        <div className="block md:hidden mb-6">
          <ModuloCarousel modulos={modulos} />
        </div>
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((modulo) =>
            editandoId === modulo.id ? (
              <div key={modulo.id} className="bg-neutral-800 rounded-lg p-4 shadow-lg flex flex-col h-full">
                <div className="mb-2">
                  <input
                    className="w-full p-2 rounded bg-neutral-700 text-white mb-2"
                    value={editModulo.nome}
                    onChange={(e) => setEditModulo((m) => ({ ...m, nome: e.target.value }))}
                  />
                  <input
                    className="w-full p-2 rounded bg-neutral-700 text-white mb-2"
                    value={editModulo.capa}
                    onChange={(e) => setEditModulo((m) => ({ ...m, capa: e.target.value }))}
                  />
                  <img
                    src={editModulo.capa}
                    alt={editModulo.nome}
                    className="w-full h-40 object-cover rounded mb-2"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/400x200?text=Sem+Capa")}
                  />
                </div>
                <div className="mb-2">
                  <div className="flex gap-2 mb-2">
                    <input
                      className="flex-1 p-2 rounded bg-neutral-700 text-white"
                      placeholder="Título da aula"
                      value={editAula.titulo}
                      onChange={(e) => setEditAula((a) => ({ ...a, titulo: e.target.value }))}
                    />
                    <input
                      className="flex-1 p-2 rounded bg-neutral-700 text-white"
                      placeholder="URL do vídeo"
                      value={editAula.videoUrl}
                      onChange={(e) => setEditAula((a) => ({ ...a, videoUrl: e.target.value }))}
                    />
                    <Button type="button" onClick={handleAdicionarAulaEdicao}>
                      <Plus size={16} />
                    </Button>
                  </div>
                  <ul className="mb-2">
                    {editModulo.aulas.map((aula, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm mb-1">
                        <Video size={16} /> {aula.titulo}
                        <button
                          className="ml-2 text-red-400 hover:text-red-600"
                          onClick={() => handleRemoverAulaEdicao(idx)}
                          title="Remover aula"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button className="flex-1" onClick={salvarEdicao}>
                    <Save className="mr-2" size={16} /> Salvar
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={cancelarEdicao}>
                    <X className="mr-2" size={16} /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div key={modulo.id} className="bg-neutral-800 rounded-lg p-4 shadow-lg flex flex-col h-full">
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
                <Button className="mt-auto w-full" variant="secondary" onClick={() => iniciarEdicao(modulo.id)}>
                  <Edit className="mr-2" size={16} /> Editar
                </Button>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;