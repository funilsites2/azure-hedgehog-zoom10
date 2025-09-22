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
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useBanner } from "@/context/BannerContext";
import { useLogo } from "@/context/LogoContext";
import { usePhoto } from "@/context/PhotoContext";
import { useUser } from "@/context/UserContext";
import { Footer } from "@/components/Footer";

function getYoutubeThumbnail(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "/placeholder.svg";
}

const MENU_ITEMS = [
  { key: "continuar", label: "Continuar", icon: Play },
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

  function renderMainContent() {
    if (mobileTab === "continuar") {
      if (partialAulas.length > 0) {
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Continuar Assistindo</h2>
            <div className="flex flex-col gap-4">
              {partialAulas.map(({ modulo: m, aula: a }) => (
                <div key={`${m.id}-${a.id}`} className="space-y-1">
                  <span className="text-lg font-semibold">{m.nome}</span>
                  <span className="text-neutral-300">{a.titulo}</span>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => {
                      setModuloSelecionado(m.id);
                      setAulaSelecionada(a.id);
                    }}
                  >
                    Continuar
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return <p className="p-8 text-neutral-300">Você concluiu todas as aulas!</p>;
    }
    if (mobileTab === "modulos") {
      if (!modulo) {
        return (
          <div className="container mx-auto mt-8 space-y-6">
            {linhas.map((linha) => {
              const mods = modulos.filter((m) => m.linha === linha);
              if (!mods.length) return null;
              return (
                <div
                  key={linha}
                  className="bg-neutral-800 bg-opacity-20 p-4 rounded-lg"
                >
                  <h3 className="text-2xl font-semibold mb-4">{linha}</h3>
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
        );
      }
      if (modulo.bloqueado) {
        setModuloSelecionado(null);
        return null;
      }
      return (
        <>
          <button
            className="mb-6 mt-8 ml-4 flex items-center gap-2 text-neutral-400 hover:text-white transition"
            onClick={() => setModuloSelecionado(null)}
          >
            <ArrowLeft size={20} /> Voltar
          </button>
          <div className="flex-1 flex overflow-hidden">
            <AulaPlayer
              modulo={modulo}
              aulaSelecionadaId={aulaSelecionada ?? modulo.aulas[0]?.id}
              onSelecionarAula={setAulaSelecionada}
              onMarcarAssistida={(id) =>
                marcarAulaAssistida(modulo.id, id)
              }
            />
          </div>
        </>
      );
    }
    if (mobileTab === "progresso") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart2 size={24} /> Progresso Geral
          </h2>
          <Progress value={progresso} className="h-4 bg-neutral-800" />
          <div className="mt-2 text-lg">{progresso}% concluído</div>
        </div>
      );
    }
    if (mobileTab === "conquistas") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award size={24} className="text-yellow-400" /> Conquistas
          </h2>
          <ul className="text-base">
            <li className="mb-2">
              {aulasAssistidas >= 1 ? (
                <CheckCircle
                  className="inline text-green-400 mr-1"
                  size={18}
                />
              ) : (
                <span className="inline-block w-5" />
              )}
              Primeira aula assistida
            </li>
            <li>
              {progresso === 100 ? (
                <CheckCircle
                  className="inline text-green-400 mr-1"
                  size={18}
                />
              ) : (
                <span className="inline-block w-5" />
              )}
              Curso completo!
            </li>
          </ul>
        </div>
      );
    }
    if (mobileTab === "bloqueados") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock size={24} className="text-red-400" /> Bloqueados
          </h2>
          <ModuloCarousel modulos={modulos} alunoLayout showLocked />
        </div>
      );
    }
    return null;
  }

  // ... restante do componente (MobileDrawer, DesktopSidebar, Miniaturas, Footer)
}