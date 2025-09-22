import { useState } from "react";
import {
  Plus,
  Video,
  Layers,
  Trash2,
  Edit,
  Lock as LockIcon,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModulos } from "@/context/ModulosContext";
import { ModuleForm } from "@/components/ModuleForm";
import { BannerSettings } from "@/components/BannerSettings";
import { LogoSettings } from "@/components/LogoSettings";
import { Footer } from "@/components/Footer";

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
    delayDays: number;
  }>({ moduloId: "", titulo: "", videoUrl: "", delayDays: 0 });

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const iniciarEdicao = (moduloId: number) => setEditandoId(moduloId);
  const cancelarEdicao = () => setEditandoId(null);

  const handleEditSubmit = (
    nome: string,
    capa: string,
    aulas: { titulo: string; videoUrl: string }[],
    linha: string,
    delayDays: number
  ) => {
    if (editandoId !== null) {
      editarModulo(editandoId, nome, capa, aulas, linha, delayDays);
      cancelarEdicao();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0 space-y-6">
          <LogoSettings />
          <BannerSettings />

          <div>
            <h3 className="font-semibold mb-2">Novo Módulo</h3>
            <ModuleForm
              onSubmit={(nome, capa, aulas, linha, delayDays) =>
                adicionarModulo(nome, capa, aulas, linha, delayDays)
              }
              submitLabel="Adicionar Módulo"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Nova Aula</h3>
            <div className="space-y-2">
              <select
                className="w-full p-2 rounded bg-neutral-800 text-white"
                value={novaAulaExistente.moduloId}
                onChange={(e) =>
                  setNovaAulaExistente((v) => ({
                    ...v,
                    moduloId:
                      e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              >
                <option value="">Selecionar módulo</option>
                {modulos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
              <input
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="Título da aula"
                value={novaAulaExistente.titulo}
                onChange={(e) =>
                  setNovaAulaExistente((v) => ({
                    ...v,
                    titulo: e.target.value,
                  }))
                }
              />
              <input
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="URL do vídeo"
                value={novaAulaExistente.videoUrl}
                onChange={(e) =>
                  setNovaAulaExistente((v) => ({
                    ...v,
                    videoUrl: e.target.value,
                  }))
                }
              />
              <input
                type="number"
                min={0}
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="Dias para liberar aula"
                value={novaAulaExistente.delayDays}
                onChange={(e) =>
                  setNovaAulaExistente((v) => ({
                    ...v,
                    delayDays: Number(e.target.value),
                  }))
                }
              />
              <Button
                onClick={() => {
                  const { moduloId, titulo, videoUrl, delayDays } =
                    novaAulaExistente;
                  if (
                    moduloId &&
                    titulo.trim() !== "" &&
                    videoUrl.trim() !== ""
                  ) {
                    adicionarAula(
                      moduloId,
                      titulo.trim(),
                      videoUrl.trim(),
                      delayDays
                    );
                    setNovaAulaExistente({
                      moduloId: "",
                      titulo: "",
                      videoUrl: "",
                      delayDays: 0,
                    });
                  }
                }}
              >
                Adicionar Aula
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-auto pb-16 md:pb-5 space-y-8">
          <h1 className="text-3xl font-bold">Módulos</h1>

          {/* Edição de módulo */}
          {editandoId !== null ? (
            <div className="bg-neutral-800 p-6 rounded-lg">
              <h2 className="text-2xl mb-4">Editando Módulo</h2>
              {(() => {
                const m = modulos.find((mod) => mod.id === editandoId);
                if (!m) return null;
                return (
                  <>
                    <ModuleForm
                      initialNome={m.nome}
                      initialCapa={m.capa}
                      initialLinha={m.linha}
                      initialAulas={m.aulas.map((a) => ({
                        titulo: a.titulo,
                        videoUrl: a.videoUrl,
                      }))}
                      initialDelayDays={m.releaseDate
                        ? Math.max(
                            0,
                            Math.round(
                              (m.releaseDate - Date.now()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        : 0}
                      onSubmit={handleEditSubmit}
                      onCancel={cancelarEdicao}
                      submitLabel="Atualizar Módulo"
                    />
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Bloqueio de Aulas</h3>
                      {m.aulas.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between mb-2"
                        >
                          <span>{a.titulo}</span>
                          <Button
                            variant={a.bloqueado ? "destructive" : "outline"}
                            onClick={() =>
                              setAulaBloqueada(m.id, a.id, !a.bloqueado)
                            }
                          >
                            {a.bloqueado ? "Desbloquear" : "Bloquear"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {modulos.map((m) => (
                <div
                  key={m.id}
                  className="bg-neutral-800 p-4 rounded-lg flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{m.nome}</h3>
                    <p className="text-sm text-neutral-400 mb-2">
                      Linha: {m.linha}
                    </p>
                    <img
                      src={m.capa}
                      alt={m.nome}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => iniciarEdicao(m.id)}
                      className="flex-1"
                    >
                      <Edit size={16} className="mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant={m.bloqueado ? "destructive" : "outline"}
                      onClick={() =>
                        setModuloBloqueado(m.id, !m.bloqueado)
                      }
                      className={`flex-1 ${
                        !m.bloqueado
                          ? "bg-white !text-black hover:bg-neutral-100"
                          : ""
                      }`}
                    >
                      {m.bloqueado ? (
                        <>
                          <Unlock size={16} className="mr-1" />
                          Desbloquear
                        </>
                      ) : (
                        <>
                          <LockIcon size={16} className="mr-1" />
                          Bloquear
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}