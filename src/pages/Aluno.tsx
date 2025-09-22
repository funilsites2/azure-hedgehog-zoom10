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
import { useLogo } from "@/context/LogoContext";
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
  // ... rest of state and renderMainContent unchanged

  const DesktopSidebar = (
    <aside
      className={`hidden md:flex flex-col bg-neutral-950 border-r border-neutral-800 transition-all ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex flex-col items-center space-y-4">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
        )}
        <img
          src="/placeholder.svg"
          alt="Foto do aluno"
          className="w-16 h-16 rounded-full border-2 border-neutral-800"
        />
      </div>
      {/* ... rest stays the same */}
    </aside>
  );

  // ... mobile drawer, footer, main return unchanged
}