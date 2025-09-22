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

  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0">
          <LogoSettings />
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
          <BannerSettings />
        </aside>
        {/* ... rest stays the same */}
      </div>
      <Footer />
    </>
  );
}