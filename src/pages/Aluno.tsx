import { useState } from "react";
import {
  Layers,
  ArrowLeft,
  Menu,
  X,
  BookOpen,
  BarChart2,
  Award,
  Lock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useBanner } from "@/context/BannerContext";
import { useStudent } from "@/context/StudentContext";
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
  const { logoUrl, student } = useStudent();
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(
    null
  );
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(
    null
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<
    typeof MENU_ITEMS[number]["key"]
  >("modulos");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ... existing logic

  const DesktopSidebar = (
    <aside
      className={`hidden md:flex flex-col bg-neutral-950 border-r border-neutral-800 transition-all ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className="h-10 object-contain"
          />
        ) : (
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers size={24} /> Aluno
          </h2>
        )}
      </div>
      {!sidebarCollapsed && (
        <div className="flex flex-col items-center p-4">
          {student.imageUrl && (
            <img
              src={student.imageUrl}
              alt={student.name}
              className="w-16 h-16 rounded-full mb-2"
            />
          )}
          {student.name && (
            <span className="text-white font-medium">{student.name}</span>
          )}
        </div>
      )}
      {/* existing nav buttons */}
    </aside>
  );

  // ... rest of component unchanged, ensure DesktopSidebar is used

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      {/* mobile toggle, MobileDrawer */}
      {DesktopSidebar}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        <main className="flex-1 overflow-auto pb-[84px] md:pb-5">
          {/* banner and renderMainContent */}
        </main>
        {/* MobileFooter */}
        <Footer />
      </div>
    </div>
  );
}