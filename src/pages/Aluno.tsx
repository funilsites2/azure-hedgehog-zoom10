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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useBanner } from "@/context/BannerContext";

const MENU_ITEMS = [
  { key: "modulos", label: "Módulos", icon: BookOpen },
  { key: "progresso", label: "Progresso", icon: BarChart2 },
  { key: "conquistas", label: "Conquistas", icon: Award },
  { key: "bloqueados", label: "Bloqueados", icon: Lock },
] as const;

export default function Aluno() {
  const { modulos, marcarAulaAssistida } = useModulos();
  const { bannerUrl } = useBanner();
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<typeof MENU_ITEMS[number]["key"]>("modulos");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ... resto do código mantém-se igual ...

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white overflow-hidden relative">
      {/* botão e sidebars omitidos para brevidade */}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {bannerUrl && (
          <div className="p-4">
            <img src={bannerUrl} alt="Banner Aluno" className="w-full object-cover rounded-lg" />
          </div>
        )}
        <main className="flex-1 overflow-auto">{renderMainContent()}</main>
        {MobileFooter}
      </div>
    </div>
  );
}