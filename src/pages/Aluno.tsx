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
    columnNames,
    setColumnName,
  } = useModulos();
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<typeof MENU_ITEMS[number]["key"]>("modulos");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Progresso geral
  const totalAulas = modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (acc, m) => acc + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas ? Math.round((aulasAssistidas / totalAulas) * 100) : 0;

  const modulo = modulos.find((m) => m.id === moduloSelecionado);

  function renderMainContent() {
    if (mobileTab === "modulos") {
      if (!modulo) {
        return (
          <>
            <h1 className="text-3xl font-bold mb-6 mt-8 ml-8">Módulos</h1>
            <div className="space-y-8 px-4">
              {[1, 2, 3].map((col) => {
                const mods = modulos.filter((m) => m.coluna === col);
                if (mods.length === 0) return null;
                return (
                  <div key={col}>
                    <div className="flex items-center mb-4 ml-2">
                      <input
                        type="text"
                        value={columnNames[col] || ""}
                        onChange={(e) => setColumnName(col, e.target.value)}
                        className="text-2xl font-semibold bg-neutral-800 text-white p-1 rounded w-full max-w-xs"
                      />
                    </div>
                    <ModuloCarousel
                      modulos={mods}
                      alunoLayout
                      onModuloClick={(m) => {
                        setModuloSelecionado(m.id);
                        setAulaSelecionada(m.aulas[0]?.id ?? null);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        );
      }
      // ... restante igual ...
    }
    // ... restante igual ...
  }

  // ... restante do componente inalterado ...
}