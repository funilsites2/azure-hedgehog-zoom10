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
import { showSuccess } from "@/utils/toast";

function getYoutubeThumbnail(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "/placeholder.svg";
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

  // ... renderMainContent, MobileDrawer, etc. permanecem iguais ...

  const DesktopSidebar = (
    <aside className="hidden md:flex flex-col items-center bg-neutral-950 p-6 space-y-6">
      {logoUrl && <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />}
      <img
        src={photoUrl || "/placeholder.svg"}
        alt="Foto do aluno"
        className="w-16 h-16 rounded-full border-2 border-green-500"
      />
      <div className="w-full">
        <Progress value={progresso} className="h-2 bg-neutral-800 rounded" />
        <div className="text-xs text-neutral-300 mt-1">{progresso}% concluído</div>
      </div>
      <nav className="flex flex-col space-y-2 w-full">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setMobileTab(item.key);
              if (item.key === "modulos") setModuloSelecionado(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 w-full text-neutral-300 rounded ${
              mobileTab === item.key
                ? "bg-green-600 text-white"
                : "hover:bg-green-600 hover:text-white"
            }`}
          >
            <item.icon size={20} className="text-green-500" />
            <span>{item.label}</span>
          </button>
        ))}
        <Link
          to="/perfil"
          className="flex items-center gap-3 px-4 py-3 w-full text-neutral-300 hover:bg-green-600 hover:text-white rounded"
        >
          <User size={20} className="text-green-500" />
          <span>Perfil</span>
        </Link>
      </nav>
    </aside>
  );

  const MobileFooter = (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden bg-neutral-950 border-t border-neutral-800 h-16">
      {/* ... */}
    </nav>
  );

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      {/* ... */}
      {DesktopSidebar}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {/* ... */}
        {MobileFooter}
        <Footer />
      </div>
    </div>
  );
}