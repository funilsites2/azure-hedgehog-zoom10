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
import { useBanner } from "@/context/BannerContext";
import { useStudentSettings } from "@/context/StudentSettingsContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { Footer } from "@/components/Footer";

export default function Aluno() {
  const { modulos, marcarAulaAssistida } = useModulos();
  const { bannerUrl } = useBanner();
  const { color, logoUrl } = useStudentSettings();
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"modulos" | "progresso" | "conquistas" | "bloqueados">("modulos");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));
  const totalAulas = modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (acc, m) => acc + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas ? Math.round((aulasAssistidas / totalAulas) * 100) : 0;

  const modulo = modulos.find((m) => m.id === moduloSelecionado);

  // ... renderMainContent e sidebars idem ...

  return (
    <div
      className="min-h-screen w-screen flex flex-col md:flex-row text-white relative"
      style={{ backgroundColor: color }}
    >
      {/* logo */}
      {logoUrl && (
        <div className="fixed top-4 right-4 z-20">
          <img src={logoUrl} alt="Logo Aluno" className="h-12 object-contain" />
        </div>
      )}
      {/* resto do componente sem alterar */}
    </div>
  );
}