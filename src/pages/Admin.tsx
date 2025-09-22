import { useState } from "react";
import {
  Plus,
  Video,
  Layers,
  Trash2,
  Edit,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModulos } from "@/context/ModulosContext";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { ModuleForm } from "@/components/ModuleForm";

export default function Admin() {
  const {
    modulos,
    adicionarModulo,
    adicionarAula,
    editarModulo,
    setModuloBloqueado,
    setAulaBloqueada,
  } = useModulos();

  const [novaAulaExistente, setNovaAulaExistente] = useState<{
    moduloId: number | "";
    titulo: string;
    videoUrl: string;
  }>({ moduloId: "", titulo: "", videoUrl: "" });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const iniciarEdicao = (moduloId: number) => {
    const m = modulos.find((x) => x.id === moduloId);
    if (!m) return;
    setEditandoId(moduloId);
  };
  const cancelarEdicao = () => setEditandoId(null);

  const handleEditSubmit = (
    nome: string,
    capa: string,
    aulas: { titulo: string; videoUrl: string }[],
    linha: string
  ) => {
    if (editandoId !== null) {
      editarModulo(editandoId, nome, capa, aulas, linha);
      cancelarEdicao();
    }
  };

  // Agrupa nomes de linha únicos
  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex">
      <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0">
        <h3 className="font-semibold mb-4">Novo Módulo</h3>
        <ModuleForm
          onSubmit={(nome, capa, aulas, linha) =>
            adicionarModulo(nome, capa, aulas, linha)
          }
          submitLabel="Adicionar Módulo"
        />
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Nova Aula em Módulo Existente</h3>
          <select
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            value={novaAulaExistente.moduloId}
            onChange={(e) =>
              setNovaAulaExistente((a) => ({
                ...a,
                moduloId: Number(e.target.value),
              }))
            }
          >
            <option value="">Selecione o módulo</option>
            {modulos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} ({m.linha})
              </option>
            ))}
          </select>
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="Título da aula"
            value={novaAulaExistente.titulo}
            onChange={(e) =>
              setNovaAulaExistente((a) => ({
                ...a,
                titulo: e.target.value,
              }))
            }
          />
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="URL do vídeo"
            value={novaAulaExistente.videoUrl}
            onChange={(e) =>
              setNovaAulaExistente((a) => ({
                ...a,
                videoUrl: e.target.value,
              }))
            }
          />
          <Button
            className="w-full"
            onClick={() => {
              if (
                novaAulaExistente.moduloId &&
                novaAulaExistente.titulo &&
                novaAulaExistente.videoUrl
              ) {
                adicionarAula(
                  Number(novaAulaExistente.moduloId),
                  novaAulaExistente.titulo,
                  novaAulaExistente.videoUrl
                );
                setNovaAulaExistente({ moduloId: "", titulo: "", videoUrl: "" });
              }
            }}
          >
            <Video className="mr-2" size={16} /> Adicionar Aula
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Módulos</h1>
        {/* Visualização móvel */}
        <div className="block md:hidden mb-6">
          {linhas.map((linha) => {
            const mods = modulos.filter((m) => m.linha === linha);
            return mods.length ? (
              <div key={linha} className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{linha}</h2>
                <ModuloCarousel modulos={mods} />
              </div>
            ) : null;
          })}
        </div>
        {/* Desktop */}
        <div className="hidden md:flex flex-col gap-8">
          {linhas.map((linha) => {
            const mods = modulos.filter((m) => m.linha === linha);
            return mods.length ? (
              <div key={linha}>
                <h2 className="text-2xl font-semibold mb-4">{linha}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mods.map((modulo) =>
                    editandoId === modulo.id ? (
                      <div
                        key={modulo.id}
                        className="bg-neutral-800 p-4 rounded shadow"
                      >
                        <ModuleForm
                          initialNome={modulo.nome}
                          initialCapa={modulo.capa}
                          initialLinha={modulo.linha}
                          initialAulas={modulo.aulas.map((a) => ({
                            titulo: a.titulo,
                            videoUrl: a.videoUrl,
                          }))}
                          onSubmit={handleEditSubmit}
                          onCancel={cancelarEdicao}
                          submitLabel="Salvar Edição"
                        />
                      </div>
                    ) : (
                      <div
                        key={modulo.id}
                        className="bg-neutral-800 rounded-lg p-4 shadow flex flex-col h-full"
                      >
                        <img
                          src={modulo.capa}
                          alt={modulo.nome}
                          className="w-full h-40 object-cover rounded mb-2"
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://placehold.co/400x200?text=Sem+Capa")
                          }
                        />
                        <h3 className="text-xl font-semibold mb-2">
                          {modulo.nome}
                        </h3>
                        <span className="text-sm text-neutral-400 mb-4">
                          {modulo.linha}
                        </span>
                        <ul className="flex-1 space-y-2 mb-4">
                          {modulo.aulas.map((a) => (
                            <li
                              key={a.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>{a.titulo}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  setAulaBloqueada(
                                    modulo.id,
                                    a.id,
                                    !a.bloqueado
                                  )
                                }
                                title={
                                  a.bloqueado
                                    ? "Desbloquear aula"
                                    : "Bloquear aula"
                                }
                              >
                                {a.bloqueado ? (
                                  <Unlock size={16} />
                                ) : (
                                  <Lock size={16} />
                                )}
                              </Button>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setModuloBloqueado(modulo.id, !modulo.bloqueado)
                            }
                          >
                            {modulo.bloqueado ? (
                              <Unlock className="mr-2" size={16} />
                            ) : (
                              <Lock className="mr-2" size={16} />
                            )}
                            {modulo.bloqueado ? "Desbloquear" : "Bloquear"}
                          </Button>
                          <Button onClick={() => iniciarEdicao(modulo.id)}>
                            <Edit className="mr-2" size={16} /> Editar
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </main>
    </div>
);
}