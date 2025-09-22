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
import { StudentSettings } from "@/components/StudentSettings";
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
          <h3 className="font-semibold mb-4">Novo Módulo</h3>
          <ModuleForm
            onSubmit={(nome, capa, aulas, linha) =>
              adicionarModulo(nome, capa, aulas, linha)
            }
            submitLabel="Adicionar Módulo"
          />
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Nova Aula em Módulo Existente</h3>
            {/* ... */}
          </div>
          <BannerSettings />
          <StudentSettings />
        </aside>
        {/* resto igual */}
        <main className="flex-1 p-8 overflow-auto pb-16 md:pb-5">
          {/* ... */}
        </main>
      </div>
      <Footer />
    </>
  );
}