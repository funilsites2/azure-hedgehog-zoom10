import { useState } from "react";
import {
  Layers,
  ArrowLeft,
  Star,
  CheckCircle,
  Menu,
  X,
  BookOpen,
  BarChart2,
  Award,
  Lock,
  ChevronLeft,
  ChevronRight,
  User,
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ... restante do renderMainContent

  const MobileDrawer = (
    <div
      className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setMobileMenuOpen(false)}
    >
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-neutral-950/90 backdrop-blur-sm p-6 flex flex-col gap-4 border-r border-neutral-800 shadow-lg transition-transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="self-end text-neutral-400 hover:text-white"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={28} className="text-green-500" />
        </button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Olá, {name}
        </h2>
        <nav className="flex flex-col">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.key === "modulos" ? "/aluno" : "#"}
              className="relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-green-600 hover:text-white text-neutral-300"
              onClick={() => {
                setMobileTab(item.key);
                setMobileMenuOpen(false);
              }}
            >
              <item.icon size={20} className="text-green-500" />
              <span className="flex-1">{item.label}</span>
              <div className="h-0.5 bg-green-500 w-full absolute left-0 bottom-0"></div>
            </Link>
          ))}
          <Link
            to="/perfil"
            className="relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-green-600 hover:text-white text-neutral-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={20} className="text-green-500" />
            <span className="flex-1">Perfil</span>
            <div className="h-0.5 bg-green-500 w-full absolute left-0 bottom-0"></div>
          </Link>
        </nav>
      </div>
    </div>
  );

  const DesktopSidebar = (
    <aside
      className={`hidden md:flex flex-col bg-neutral-950/80 backdrop-blur-sm border-r border-neutral-800 transition-all ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex flex-col items-center space-y-4">
        {logoUrl && <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />}
        <img
          src={photoUrl || "/placeholder.svg"}
          alt="Foto do aluno"
          className="w-16 h-16 rounded-full border-2 border-green-500"
        />
        {!sidebarCollapsed && (
          <div className="text-green-500 font-semibold">{name}</div>
        )}
      </div>
      {/* ... restante do DesktopSidebar */}
    </aside>
  );

  // ... restante do componente incluindo MobileFooter, renderMainContent etc.

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-neutral-950 rounded-full p-2 border border-neutral-800 shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu size={28} className="text-green-500" />
      </button>
      {MobileDrawer}
      {DesktopSidebar}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {/* ... conteúdo principal */}
        <Footer />
      </div>
    </div>
  );
}