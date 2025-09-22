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
  }>({ moduloId: "", titulo: "", videoUrl: "" });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const iniciarEdicao = (moduloId: number) => {
    setEditandoId(moduloId);
  };
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

  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0">
          <LogoSettings />
          <h3 className="font-semibold mb-4">Novo Módulo</h3>
          <ModuleForm
            onSubmit={(nome, capa, aulas, linha, delayDays) =>
              adicionarModulo(nome, capa, aulas, linha, delayDays)
            }
            submitLabel="Adicionar Módulo"
          />
          {/* ...restante da sidebar sem alterações */}
        </aside>
        <main className="flex-1 p-8 overflow-auto pb-16 md:pb-5">
          <h1 className="text-3xl font-bold mb-6">Módulos</h1>
          {/* ...mobile e desktop view */}
          <div className="hidden md:flex flex-col gap-8">
            {linhas.map((linha) => {
              const mods = modulos.filter((m) => m.linha === linha);
              return (
                mods.length > 0 && (
                  <div key={linha}>
                    <h2 className="text-2xl font-semibold mb-4">{linha}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mods.map((modulo) =>
                        editandoId === modulo.id ? (
                          <div key={modulo.id} className="bg-neutral-800 p-4 rounded shadow">
                            <ModuleForm
                              initialNome={modulo.nome}
                              initialCapa={modulo.capa}
                              initialLinha={modulo.linha}
                              initialAulas={modulo.aulas.map((a) => ({
                                titulo: a.titulo,
                                videoUrl: a.videoUrl,
                              }))}
                              initialDelayDays={modulo.releaseDate ? Math.max(0, Math.ceil((modulo.releaseDate - Date.now()) / (1000*60*60*24))) : 0}
                              onSubmit={handleEditSubmit}
                              onCancel={cancelarEdicao}
                              submitLabel="Salvar Edição"
                            />
                          </div>
                        ) : (
                          <div key={modulo.id} className="bg-neutral-800 rounded-lg p-4 shadow flex flex-col h-full">
                            {/* ...exibição normal */}
                             <Button onClick={() => iniciarEdicao(modulo.id)}>
                              Editar
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}