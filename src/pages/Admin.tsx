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

  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0 space-y-6">
          <LogoSettings />
          <BannerSettings />

          {/* Formulário de Módulo */}
          <div>
            <h3 className="font-semibold mb-2">Novo Módulo</h3>
            <ModuleForm
              onSubmit={(nome, capa, aulas, linha, delayDays) =>
                adicionarModulo(nome, capa, aulas, linha, delayDays)
              }
              submitLabel="Adicionar Módulo"
            />
          </div>

          {/* Adicionar Aula Existente */}
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
          {/* ... restante inalterado */}
        </main>
      </div>
      <Footer />
    </>
  );
}