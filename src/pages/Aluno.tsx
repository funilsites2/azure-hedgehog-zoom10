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
import { BannerSlider } from "@/components/BannerSlider";

const MENU_ITEMS = [
  { key: "modulos", label: "Módulos", icon: BookOpen },
  { key: "progresso", label: "Progresso", icon: BarChart2 },
  { key: "conquistas", label: "Conquistas", icon: Award },
  { key: "bloqueados", label: "Bloqueados", icon: Lock },
] as const;

export default function Aluno() {
  const { modulos, marcarAulaAssistida } = useModulos();
  const { banners } = useBanner();
  // ... mantém todo o resto igual até o return ...

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white overflow-hidden relative">
      {/* ... menu, sidebars etc ... */}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {banners.length > 0 && (
          <div className="p-4">
            <BannerSlider banners={banners} />
          </div>
        )}
        <main className="flex-1 overflow-auto">
          {renderMainContent()}
        </main>
        {MobileFooter}
      </div>
    </div>
  );
}