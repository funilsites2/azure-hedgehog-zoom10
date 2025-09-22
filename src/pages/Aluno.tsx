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
  const [mobileTab, setMobileTab] = useState<typeof MENU_ITEMS[number]["key"]>(
    "modulos"
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Agrupar linhas e calcular progresso geral
  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));
  const totalAulas = modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (acc, m) => acc + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas
    ? Math.round((aulasAssistidas / totalAulas) * 100)
    : 0;

  const modulo = modulos.find((m) => m.id === moduloSelecionado);

  function renderMainContent() {
    if (mobileTab === "modulos") {
      if (!modulo) {
        return (
          <div className="mt-8 space-y-8 px-4">
            {linhas.map((linha) => {
              const mods = modulos.filter((m) => m.linha === linha);
              if (mods.length === 0) return null;
              return (
                <div key={linha}>
                  <h2 className="text-2xl font-semibold mb-4">{linha}</h2>
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
        );
      } else {
        if (modulo.bloqueado) {
          setModuloSelecionado(null);
          return null;
        }
        return (
          <>
            <button
              className="relative z-60 mb-6 mt-8 ml-8 flex items-center gap-2 text-neutral-400 hover:text-white transition"
              onClick={() => setModuloSelecionado(null)}
            >
              <ArrowLeft size={20} /> Voltar para aulas
            </button>
            <div className="flex-1 flex overflow-hidden">
              <AulaPlayer
                modulo={modulo}
                aulaSelecionadaId={
                  aulaSelecionada ?? modulo.aulas[0]?.id
                }
                onSelecionarAula={setAulaSelecionada}
                onMarcarAssistida={(aulaId) =>
                  marcarAulaAssistida(modulo.id, aulaId)
                }
              />
            </div>
          </>
        );
      }
    }

    if (mobileTab === "progresso") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart2 size={24} /> Progresso Geral
          </h2>
          <Progress value={progresso} className="h-4 bg-neutral-800" />
          <div className="mt-2 text-lg">{progresso}% concluído</div>
        </div>
      );
    }

    if (mobileTab === "conquistas") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award size={24} className="text-yellow-400" /> Conquistas
          </h2>
          <ul className="text-base">
            <li className="mb-2">
              {aulasAssistidas >= 1 ? (
                <CheckCircle
                  className="inline text-green-400 mr-1"
                  size={18}
                />
              ) : (
                <span className="inline-block w-5" />
              )}
              Primeira aula assistida
            </li>
            <li>
              {progresso === 100 ? (
                <CheckCircle
                  className="inline text-green-400 mr-1"
                  size={18}
                />
              ) : (
                <span className="inline-block w-5" />
              )}
              Curso completo!
            </li>
          </ul>
        </div>
      );
    }

    if (mobileTab === "bloqueados") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock size={24} className="text-red-400" /> Conteúdos bloqueados
          </h2>
          <ModuloCarousel
            modulos={modulos}
            alunoLayout
            showLocked
          />
        </div>
      );
    }

    return null;
  }

  // Mobile drawer, desktop sidebar, footer remain unchanged

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white overflow-hidden relative">
      {/* ...mobile menu button, drawer, sidebar */}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        <main className="flex-1 overflow-auto">
          {bannerUrl && (
            <div className="mb-6 mx-auto w-full max-w-[1600px] h-[200px] overflow-hidden rounded-lg">
              <img
                src={bannerUrl}
                alt="Banner Aluno"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {renderMainContent()}
        </main>
        {/* Mobile footer */}
      </div>
    </div>
  );
}