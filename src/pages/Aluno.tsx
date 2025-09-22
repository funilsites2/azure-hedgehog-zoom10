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

const MENU_ITEMS = [
  { key: "modulos", label: "Módulos", icon: BookOpen },
  { key: "progresso", label: "Progresso", icon: BarChart2 },
  { key: "conquistas", label: "Conquistas", icon: Award },
  { key: "bloqueados", label: "Bloqueados", icon: Lock },
] as const;

export default function Aluno() {
  const {
    modulos,
    marcarAulaAssistida,
    banners
  } = useModulos();
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<typeof MENU_ITEMS[number]["key"]>("modulos");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ... lógica existente

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white overflow-hidden relative">
      {/* botão burger etc */}
      {/* MobileDrawer e DesktopSidebar */}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {/* Banners */}
        {banners.length > 0 && (
          <div className="w-full overflow-x-auto whitespace-nowrap mb-4 px-4">
            {banners.map((b) => (
              <a
                key={b.id}
                href={b.linkUrl || "#"}
                className="inline-block mr-4 rounded overflow-hidden"
                target={b.linkUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                <img
                  src={b.imageUrl}
                  alt="Banner"
                  className="h-32 object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/600x200?text=Banner")
                  }
                />
              </a>
            ))}
          </div>
        )}
        <main className="flex-1 overflow-auto">{/* ... renderMainContent() */}</main>
        {/* MobileFooter */}
      </div>
    </div>
  );
}