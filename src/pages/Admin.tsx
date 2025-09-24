import { useEffect, useState } from "react";
import {
  Layers,
  Edit,
  Unlock,
  Lock,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModulos } from "@/context/ModulosContext";
import { ModuleForm, AulaInput } from "@/components/ModuleForm";
import { BannerSettings } from "@/components/BannerSettings";
import { LogoSettings } from "@/components/LogoSettings";
import { Footer } from "@/components/Footer";
import UserMenu from "@/components/UserMenu";
import { showSuccess } from "@/utils/toast";
import LessonsEditor from "@/components/LessonsEditor";

export default function Admin() {
  const modulosCtx = useModulos();
  const {
    modulos,
    adicionarModulo,
    adicionarAula,
    editarModulo,
    setAulaReleaseDays,
    duplicarModulo,
    setModuloBloqueado,
  } = modulosCtx;

  const linhas = Array.from(
    new Set(modulos.map((m) => m.linha).filter((l) => l.trim() !== ""))
  );

  // estado local de ordem por linha (apenas ids)
  const [ordemPorLinha, setOrdemPorLinha] = useState<Record<string, number[]>>(
    {}
  );

  // sincroniza a ordem local com os módulos atuais
  useEffect(() => {
    setOrdemPorLinha((prev) => {
      const next: Record<string, number[]> = { ...prev };
      const linhasAtuais = Array.from(
        new Set(modulos.map((m) => m.linha).filter((l) => l.trim() !== ""))
      );
      for (const linha of linhasAtuais) {
        const idsLinha = modulos.filter((m) => m.linha === linha).map((m) => m.id);
        const atual = next[linha] ?? idsLinha;
        // mantém ordem existente quando possível; remove ids inexistentes e inclui novos ao final
        const filtrado = atual.filter((id) => idsLinha.includes(id));
        const faltantes = idsLinha.filter((id) => !filtrado.includes(id));
        next[linha] = [...filtrado, ...faltantes];
      }
      // remove linhas que não existem mais
      Object.keys(next).forEach((l) => {
        if (!linhasAtuais.includes(l)) delete next[l];
      });
      return next;
    });
  }, [modulos]);

  const getModulosOrdenados = (linha: string) => {
    const ordem = ordemPorLinha[linha];
    const mapa = new Map(modulos.filter((m) => m.linha === linha).map((m) => [m.id, m]));
    if (!ordem) return modulos.filter((m) => m.linha === linha);
    return ordem.map((id) => mapa.get(id)).filter(Boolean) as typeof modulos;
  };

  const moverModulo = (linha: string, id: number, delta: number) => {
    setOrdemPorLinha((prev) => {
      const atual = prev[linha] ?? [];
      const idx = atual.indexOf(id);
      if (idx === -1) return prev;
      const novoIdx = Math.max(0, Math.min(atual.length - 1, idx + delta));
      if (novoIdx === idx) return prev;
      const novo = [...atual];
      const [item] = novo.splice(idx, 1);
      novo.splice(novoIdx, 0, item);
      return { ...prev, [linha]: novo };
    });
  };

  const salvarOrdem = () => {
    // ordena todos os módulos respeitando a ordem por linha e mantém os sem linha no final
    const orderedByLines = linhas.flatMap((linha) => getModulosOrdenados(linha));
    const semLinha = modulos.filter((m) => !m.linha || m.linha.trim() === "");
    const finalOrdered = [...orderedByLines, ...semLinha];

    // tenta persistir no contexto com as APIs usuais
    const anyCtx = modulosCtx as any;
    if (typeof anyCtx.reordenarModulos === "function") {
      anyCtx.reordenarModulos(finalOrdered);
      showSuccess("Ordem salva");
      return;
    }
    if (typeof anyCtx.setModulos === "function") {
      anyCtx.setModulos(finalOrdered);
      showSuccess("Ordem salva");
      return;
    }

    // fallback: salva ids no localStorage para área do aluno consumir
    try {
      const ids = finalOrdered.map((m) => m.id);
      localStorage.setItem("modulos-ordem-ids", JSON.stringify(ids));
      showSuccess("Ordem salva localmente");
      // opcional: emite evento para outras páginas ouvirem
      window.dispatchEvent(new CustomEvent("modulos-ordem-atualizada", { detail: ids }));
    } catch {
      showSuccess("Ordem aplicada aqui; para refletir para alunos, habilite persistência no contexto.");
    }
  };

  const [novaAulaExistente, setNovaAulaExistente] = useState<{
    moduloId: number | "";
    titulo: string;
    videoUrl: string;
    delayDays: number;
    descricao: string;
  }>({ moduloId: "", titulo: "", videoUrl: "", delayDays: 0, descricao: "" });

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const iniciarEdicao = (moduloId: number) => setEditandoId(moduloId);
  const cancelarEdicao = () => setEditandoId(null);

  const handleEditSubmit = (
    nome: string,
    capa: string,
    aulas: AulaInput[],
    linha: string,
    delayDays: number,
    externalUrl?: string
  ) => {
    if (editandoId !== null) {
      console.log("[Admin] Edit submit payload:", {
        editandoId,
        nome,
        capa,
        aulas,
        linha,
        delayDays,
        externalUrl,
      });

      showSuccess(
        `Enviando edição: ${aulas.length} aula(s) — verifique o console para detalhes.`
      );

      editarModulo(editandoId, nome, capa, aulas, linha, delayDays, externalUrl);
      setEditandoId(null);
      showSuccess("Módulo atualizado com sucesso");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0 space-y-6">
          <UserMenu name="Aluno" email="aluno@exemplo.com" />
          <LogoSettings />
          <BannerSettings />

          <div>
            <h3 className="font-semibold mb-2">Novo Módulo</h3>
            <ModuleForm
              onSubmit={(nome, capa, aulas, linha, delayDays, externalUrl) =>
                adicionarModulo(nome, kapaPlaceholder(capa), aulas, linha, delayDays, externalUrl)
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
                    moduloId: Number(e.target.value),
                  }))
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
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="Título da aula"
                value={novaAulaExistente.titulo}
                onChange={(e) =>
                  setNovaAulaExistente((v) => ({ ...v, titulo: e.target.value }))
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
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="Descrição da aula"
                value={novaAulaExistente.descricao}
                onChange={(e) =>
                  setNovaAulaExistente((v) => ({
                    ...v,
                    descricao: e.target.value,
                  }))
                }
              />
              <input
                type="number"
                min={0}
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="Dias para liberar (após matrícula)"
                value={novaAulaExistente.delayDays}
                onChange={(e) =>
                  setNovaAulaExistente((v) => ({
                    ...v,
                    delayDays: Number(e.target.value),
                  }))
                }
              />
              <Button
                disabled={!novaAulaExistente.moduloId}
                onClick={() => {
                  adicionarAula(
                    Number(novaAulaExistente.moduloId),
                    novaAulaExistente.titulo,
                    novaAulaExistente.videoUrl,
                    novaAulaExistente.delayDays,
                    novaAulaExistente.descricao
                  );
                  setNovaAulaExistente({
                    moduloId: "",
                    titulo: "",
                    videoUrl: "",
                    delayDays: 0,
                    descricao: "",
                  });
                }}
                className="rounded-full border border-emerald-500/30 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-500/50 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Adicionar Aula Existente
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-auto pb-16 md:pb-5 space-y-8">
          <h1 className="text-3xl font-bold">Módulos</h1>

          {editandoId !== null ? (
            <div className="bg-neutral-800 p-6 rounded-lg [&_input]:border [&_input]:border-amber-500/40 [&_[role=combobox]]:border [&_[role=combobox]]:border-amber-500/40">
              <h2 className="text-2xl mb-4">Editando Módulo</h2>
              {(() => {
                const m = modulos.find((mod) => mod.id === editandoId);
                if (!m) return null;

                const computedDelayDays =
                  typeof m.releaseOffsetDays === "number"
                    ? m.releaseOffsetDays
                    : m.releaseDate
                    ? Math.max(
                        0,
                        Math.round(
                          (m.releaseDate - Date.now()) / (1000 * 60 * 60 * 24)
                        )
                      )
                    : 0;

                return (
                  <>
                    <ModuleForm
                      initialNome={m.nome}
                      initialCapa={m.capa}
                      initialLinha={m.linha}
                      initialAulas={m.aulas}
                      initialDelayDays={computedDelayDays}
                      initialExternalUrl={m.externalUrl ?? ""}
                      onSubmit={handleEditSubmit}
                      submitLabel="Atualizar Módulo"
                      onAulasChange={(newAulas: AulaInput[]) => {
                        try {
                          editarModulo(
                            m.id,
                            m.nome,
                            m.capa,
                            newAulas,
                            m.linha,
                            computedDelayDays,
                            m.externalUrl
                          );
                          showSuccess("Aulas atualizadas");
                        } catch (err) {
                          console.error("Erro ao salvar aulas:", err);
                        }
                      }}
                    />

                    <LessonsEditor
                      initialAulas={m.aulas}
                      onChange={(newAulas: AulaInput[]) => {
                        editarModulo(
                          m.id,
                          m.nome,
                          m.capa,
                          newAulas,
                          m.linha,
                          computedDelayDays,
                          m.externalUrl
                        );
                        showSuccess("Aulas atualizadas");
                      }}
                    />

                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">
                        Dias (após matrícula) para liberar cada aula
                      </h3>
                      {m.aulas.map((a) => {
                        const currentDelay =
                          typeof a.releaseOffsetDays === "number"
                            ? a.releaseOffsetDays
                            : a.releaseDate
                            ? Math.max(
                                0,
                                Math.ceil(
                                  (a.releaseDate - Date.now()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )
                            : 0;
                        return (
                          <div
                            key={a.id}
                            className="flex items-center justify-between mb-2"
                          >
                            <span className="flex-1">{a.titulo}</span>
                            <input
                              type="number"
                              min={0}
                              className="w-20 p-1 rounded bg-neutral-800 text-white text-center"
                              value={currentDelay}
                              onChange={(e) =>
                                setAulaReleaseDays(
                                  m.id,
                                  a.id,
                                  Number(e.target.value)
                                )
                              }
                            />
                            <span className="ml-2">dias</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4">
                      <Button
                        className="w-full rounded-full border border-red-500/30 bg-red-600 text-white hover:bg-red-700 hover:border-red-500/50 shadow-sm"
                        onClick={cancelarEdicao}
                      >
                        Fechar Editor
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <>
              {linhas.map((linha) => (
                <div key={linha}>
                  <div className="flex items-center justify-between mt-8 mb-4">
                    <h2 className="text-2xl font-semibold">{linha}</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={salvarOrdem}
                        className="rounded-full"
                        title="Salvar ordem dessa linha (e demais)"
                      >
                        Salvar ordem
                      </Button>
                    </div>
                  </div>

                  {/* Mobile (empilhado) */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {getModulosOrdenados(linha).map((m) => (
                      <div
                        key={m.id}
                        className="bg-neutral-800 p-4 rounded-lg flex flex-col"
                      >
                        <img
                          src={m.capa}
                          alt={m.nome}
                          className="w-full h-[420px] md:h-[280px] object-cover object-center rounded mb-2"
                        />
                        <h3 className="font-semibold mb-2">{m.nome}</h3>
                        <div className="mt-auto flex gap-2 flex-wrap">
                          <Button onClick={() => iniciarEdicao(m.id)}>
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => duplicarModulo(m.id)}
                            title="Duplicar Módulo"
                          >
                            <Layers size={16} />
                          </Button>
                          <Button
                            variant={m.bloqueado ? "destructive" : "secondary"}
                            onClick={() =>
                              setModuloBloqueado(m.id, !m.bloqueado)
                            }
                            title={
                              m.bloqueado
                                ? "Desbloquear Módulo"
                                : "Bloquear Módulo"
                            }
                          >
                            {m.bloqueado ? <Lock size={16} /> : <Unlock size={16} />}
                          </Button>

                          {/* Controles de ordem (mobile) */}
                          <Button
                            variant="secondary"
                            onClick={() => moverModulo(linha, m.id, -1)}
                            title="Mover para cima"
                          >
                            <ArrowUp size={16} />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => moverModulo(linha, m.id, 1)}
                            title="Mover para baixo"
                          >
                            <ArrowDown size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop (carrossel horizontal) */}
                  <div className="hidden md:flex overflow-x-auto gap-4 snap-x snap-mandatory px-2">
                    {getModulosOrdenados(linha).map((m) => (
                      <div
                        key={m.id}
                        className="snap-start flex-shrink-0 w-[20%] bg-neutral-800 p-4 rounded-lg flex flex-col"
                      >
                        <img
                          src={m.capa}
                          alt={m.nome}
                          className="w-full h-[280px] object-cover object-center rounded mb-2"
                        />
                        <h3 className="font-semibold mb-2">{m.nome}</h3>
                        <div className="mt-auto flex gap-2 flex-wrap">
                          <Button onClick={() => iniciarEdicao(m.id)}>
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => duplicarModulo(m.id)}
                            title="Duplicar Módulo"
                          >
                            <Layers size={16} />
                          </Button>
                          <Button
                            variant={m.bloqueado ? "destructive" : "secondary"}
                            onClick={() =>
                              setModuloBloqueado(m.id, !m.bloqueado)
                            }
                            title={
                              m.bloqueado
                                ? "Desbloquear Módulo"
                                : "Bloquear Módulo"
                            }
                          >
                            {m.bloqueado ? <Lock size={16} /> : <Unlock size={16} />}
                          </Button>

                          {/* Controles de ordem (desktop) */}
                          <Button
                            variant="secondary"
                            onClick={() => moverModulo(linha, m.id, -1)}
                            title="Mover para a esquerda"
                          >
                            <ArrowLeft size={16} />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => moverModulo(linha, m.id, 1)}
                            title="Mover para a direita"
                          >
                            <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

// small helper to avoid accidental variable typo in earlier edit
function kapaPlaceholder(v: string) {
  return v;
}