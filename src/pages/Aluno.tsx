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

  // cálculo de próxima aula
  const { nextMod, nextAula } = (() => {
    let nm = null;
    let na = null;
    for (const m of modulos) {
      const a = m.aulas.find((a) => !a.assistida);
      if (a) {
        nm = m;
        na = a;
        break;
      }
    }
    return { nextMod: nm as typeof m, nextAula: na as typeof a };
  })();

  // lista de todas as aulas não concluídas
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
    // ... (mesma implementação)
  }

  // ... (MobileDrawer, DesktopSidebar, MobileFooter, etc.)

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      {/* ... ícone de menu, Drawer e Sidebar ... */}

      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {bannerUrl && moduloSelecionado === null && (
          <div className="mx-4 my-4 flex justify-center">
            <div className="w-full max-w-[1600px] h-[400px] overflow-hidden rounded-lg">
              <img
                src={bannerUrl}
                alt="Banner Aluno"
                className="w-full h-full object-cover object-left"
              />
            </div>
          </div>
        )}

        {/* seção Continuar Assistindo com todos os vídeos não concluídos */}
        {moduloSelecionado === null && partialAulas.length > 0 && (
          <div className="container mx-auto mb-8">
            <h3 className="text-2xl font-semibold mb-4">Continuar Assistindo</h3>
            <div className="flex overflow-x-auto gap-6 pb-2">
              {partialAulas.map(({ modulo: m, aula: a }) => (
                <div
                  key={`${m.id}-${a.id}`}
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setModuloSelecionado(m.id);
                    setAulaSelecionada(a.id);
                  }}
                >
                  <img
                    src={getYoutubeThumbnail(a.videoUrl)}
                    alt={a.titulo}
                    className="w-56 h-auto rounded-lg"
                  />
                  <p className="mt-2 text-lg font-medium">{m.nome}</p>
                  <p className="text-neutral-300 truncate">{a.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto pb-[84px] md:pb-5">
          {renderMainContent()}
        </div>

        {/* rodapé móvel e Footer */}
        { /* ... MobileFooter e <Footer /> ... */ }
      </div>
    </div>
  );
}