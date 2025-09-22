import { useState } from "react";
import {
  Menu,
  X,
  ArrowLeft,
  BookOpen,
  BarChart2,
  Award,
  Lock,
  CheckCircle,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import SimpleProgress from "@/components/SimpleProgress";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useBanner } from "@/context/BannerContext";
import { useLogo } from "@/context/LogoContext";
import { usePhoto } from "@/context/PhotoContext";
import { useUser } from "@/context/UserContext";
import { Footer } from "@/components/Footer";
import { showSuccess } from "@/utils/toast";

function getYoutubeThumbnail(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : "/placeholder.svg";
}

const MENU_ITEMS = [
  { key: "modulos", label: "Módulos", icon: BookOpen },
  { key: "progresso", label: "Progresso", icon: BarChart2 },
  { key: "conquistas", label: "Conquistas", icon: Award },
  { key: "bloqueados", label: "Bloqueados", icon: Lock },
] as const;

export default function Aluno() {
  const { modulos, marcarAulaAssistida } = useModulos();
  const { bannerUrl } = useBanner();
  const { logoUrl } = useLogo();
  const { photoUrl } = usePhoto();
  const { name } = useUser();

  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<typeof MENU_ITEMS[number]["key"]>(
    "modulos"
  );

  const now = Date.now();

  const partialAulas = modulos
    .flatMap((m) => m.aulas.map((a) => ({ modulo: m, aula: a })))
    .filter(({ aula }) => !aula.assistida);

  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));
  const totalAulas = modulos.reduce((sum, m) => sum + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (sum, m) => sum + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas
    ? Math.round((aulasAssistidas / totalAulas) * 100)
    : 0;
  const modulo = modulos.find((m) => m.id === moduloSelecionado);

  const handleMarcar = (aulaId: number) => {
    if (!modulo) return;
    marcarAulaAssistida(modulo.id, aulaId);
    const idx = modulo.aulas.findIndex((a) => a.id === aulaId);
    const next = modulo.aulas[idx + 1];
    showSuccess(
      `Aula concluída!${
        next ? ` "${next.titulo}" desbloqueada.` : " Módulo concluído!"
      }`
    );
  };

  function renderMainContent() {
    if (mobileTab === "modulos") {
      if (!modulo) {
        return (
          <>
            {/* Bloco de Continuar Assistindo */}
            {partialAulas.length > 0 && (
              <div className="mx-4 mt-8 mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  Continuar Assistindo
                </h2>
                <div className="overflow-x-auto no-scrollbar flex gap-4 snap-x snap-mandatory px-4">
                  {partialAulas.map(({ modulo: m, aula }) => (
                    <div
                      key={aula.id}
                      className="snap-start flex-none w-1/2 md:w-1/5 bg-neutral-800 p-4 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
                      onClick={() => {
                        setModuloSelecionado(m.id);
                        setAulaSelecionada(aula.id);
                      }}
                    >
                      <img
                        src={getYoutubeThumbnail(aula.videoUrl)}
                        alt={aula.titulo}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="text-white font-medium truncate">
                        {aula.titulo}
                      </p>
                      <p className="text-neutral-400 text-sm truncate">
                        {m.nome}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Blocos de módulos por linha */}
            <div className="mx-4 space-y-6">
              {linhas.map((linha) => {
                const mods = modulos.filter((m) => m.linha === linha);
                if (!mods.length) return null;
                return (
                  <div
                    key={linha}
                    className="bg-neutral-800 bg-opacity-20 p-4 rounded-lg"
                  >
                    <h3 className="text-2xl font-semibold mb-4 text-white">
                      {linha}
                    </h3>
                    <ModuloCarousel
                      modulos={mods}
                      alunoLayout
                      onModuloClick={(m) => {
                        setModuloSelecionado(m.id);
                        setAulaSelecionada(m.aulas[0]?.id ?? null);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        );
      }
      if (modulo.bloqueado) {
        setModuloSelecionado(null);
        return null;
      }
      return (
        <>
          <div className="flex items-center gap-2 mb-6 mt-8 ml-4">
            <button
              className="flex items-center gap-2 text-neutral-300 hover:text-white transition"
              onClick={() => setModuloSelecionado(null)}
            >
              <ArrowLeft size={20} /> Voltar
            </button>
            <h1 className="text-2xl font-bold">{modulo.nome}</h1>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <AulaPlayer
              modulo={modulo}
              aulaSelecionadaId={aulaSelecionada ?? modulo.aulas[0]?.id}
              onSelecionarAula={setAulaSelecionada}
              onMarcarAssistida={handleMarcar}
            />
          </div>
        </>
      );
    }
    // ... restante inalterado ...
  }

  // ... restante inalterado ...
}