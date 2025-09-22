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
import { useSettings } from "@/context/SettingsContext";
import { Footer } from "@/components/Footer";

const MENU_ITEMS = [ /* ... unchanged ... */ ] as const;

export default function Aluno() {
  const { modulos, marcarAulaAssistida } = useModulos();
  const { bannerUrl } = useBanner();
  const { color, logoUrl } = useSettings();
  // ... rest unchanged ...

  return (
    <div
      className="min-h-screen w-screen flex flex-col md:flex-row text-white relative"
      style={{ backgroundColor: color }}
    >
      {/* mobile menu button, drawers, sidebar... */}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {logoUrl && (
          <div className="mx-auto mb-4">
            <img src={logoUrl} alt="Logo Aluno" className="h-12 object-contain" />
          </div>
        )}
        <main className="flex-1 overflow-auto pb-[84px] md:pb-5">
          {bannerUrl && (/* ... */)}
          {/* ... renderMainContent */ }
        </main>
        {/* MobileFooter & Footer */}
        <Footer />
      </div>
    </div>
  );
}