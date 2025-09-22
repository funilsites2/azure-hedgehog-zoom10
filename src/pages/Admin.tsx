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
    banners,
    adicionarBanner,
    removerBanner,
  } = useModulos();

  const [novaAulaExistente, setNovaAulaExistente] = useState<{
    moduloId: number | "";
    titulo: string;
    videoUrl: string;
  }>({ moduloId: "", titulo: "", videoUrl: "" });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Estado para banners
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerLink, setBannerLink] = useState("");

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
          {/* ... existente */}
        </div>
        {/* Seção de Banners */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Banners</h3>
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="URL da imagem do banner"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-neutral-800 text-white mb-2"
            placeholder="URL de destino (opcional)"
            value={bannerLink}
            onChange={(e) => setBannerLink(e.target.value)}
          />
          <Button
            className="w-full mb-4"
            onClick={() => {
              if (bannerUrl.trim()) {
                adicionarBanner(bannerUrl.trim(), bannerLink.trim() || undefined);
                setBannerUrl("");
                setBannerLink("");
              }
            }}
          >
            <Plus className="mr-2" size={16} /> Adicionar Banner
          </Button>
          <ul className="space-y-2">
            {banners.map((b) => (
              <li key={b.id} className="flex items-center justify-between bg-neutral-800 p-2 rounded">
                <img
                  src={b.imageUrl}
                  alt="Banner"
                  className="h-12 object-cover rounded"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/300x100?text=Banner")
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerBanner(b.id)}
                  title="Remover banner"
                >
                  <Trash2 size={16} className="text-red-400" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {/* ... resto existente do Admin */}
      </main>
    </div>
  );
}