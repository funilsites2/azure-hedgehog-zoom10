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
  const { modulos, marcarAulaAssistida } = useModulos();
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<
    typeof MENU_ITEMS[number]["key"]
  >("modulos");

  // Progresso geral
  const totalAulas = modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (acc, m) => acc + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas ? Math.round((aulasAssistidas / totalAulas) * 100) : 0;

  const modulo = modulos.find((m) => m.id === moduloSelecionado);

  function renderMainContent() {
    // Aba Módulos
    if (mobileTab === "modulos") {
      if (!modulo) {
        return (
          <>
            <h1 className="text-3xl font-bold mb-6 mt-8 ml-8">Módulos</h1>
            <div className="px-4">
              <ModuloCarousel
                modulos={modulos}
                alunoLayout
                onModuloClick={(m) => {
                  setModuloSelecionado(m.id);
                  setAulaSelecionada(m.aulas[0]?.id ?? null);
                }}
              />
            </div>
          </>
        );
      } else {
        if (modulo.bloqueado) {
          setModuloSelecionado(null);
          return null;
        }
        return (
          <>
            <button
              className="mb-6 mt-8 ml-8 flex items-center gap-2 text-neutral-400 hover:text-white transition"
              onClick={() => setModuloSelecionado(null)}
            >
              <ArrowLeft size={20} /> Voltar para módulos
            </button>
            <div className="flex-1 flex overflow-hidden">
              <AulaPlayer
                modulo={modulo}
                aulaSelecionadaId={aulaSelecionada ?? modulo.aulas[0]?.id}
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

    // Aba Progresso
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

    // Aba Conquistas
    if (mobileTab === "conquistas") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award size={24} className="text-yellow-400" /> Conquistas
          </h2>
          <ul className="text-base">
            <li className="mb-2">
              {aulasAssistidas >= 1 ? (
                <CheckCircle className="inline text-green-400 mr-1" size={18} />
              ) : (
                <span className="inline-block w-5" />
              )}
              Primeira aula assistida
            </li>
            <li>
              {progresso === 100 ? (
                <CheckCircle className="inline text-green-400 mr-1" size={18} />
              ) : (
                <span className="inline-block w-5" />
              )}
              Curso completo!
            </li>
          </ul>
        </div>
      );
    }

    // Aba Bloqueados
    if (mobileTab === "bloqueados") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock size={24} className="text-red-400" /> Bloqueados
          </h2>
          <ModuloCarousel modulos={modulos} alunoLayout showLocked />
        </div>
      );
    }

    return null;
  }

  // Drawer lateral (mobile)
  const MobileDrawer = (
    <div
      className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setMobileMenuOpen(false)}
    >
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-neutral-950 p-6 flex flex-col gap-6 border-r border-neutral-800 shadow-lg transition-transform duration-200 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="self-end mb-4 text-neutral-400 hover:text-white"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={28} />
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Layers size={28} /> Aluno
        </h2>
        <nav className="flex flex-col gap-4">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`flex items-center gap-2 px-2 py-2 rounded text-left ${
                  mobileTab === item.key ? "bg-neutral-800 text-white" : "text-neutral-300"
                }`}
                onClick={() => {
                  setMobileTab(item.key);
                  setMobileMenuOpen(false);
                  setModuloSelecionado(null);
                }}
              >
                <Icon size={20} /> {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  // Nav superior (desktop)
  const DesktopNav = (
    <nav className="hidden md:flex bg-neutral-950 border-b border-neutral-800">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${
              mobileTab === item.key ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-white"
            }`}
            onClick={() => {
              setMobileTab(item.key);
              setModuloSelecionado(null);
            }}
          >
            <Icon size={18} /> {item.label}
          </button>
        );
      })}
    </nav>
  );

  // Menu rodapé (mobile)
  const MobileFooter = (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden bg-neutral-950 border-t border-neutral-800 h-16">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs ${
              mobileTab === item.key ? "text-green-400" : "text-neutral-300"
            }`}
            onClick={() => {
              setMobileTab(item.key);
              setModuloSelecionado(null);
            }}
          >
            <Icon size={22} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col bg-neutral-900 text-white overflow-hidden relative">
      {/* Menu hambúrguer mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-neutral-950 rounded-full p-2 border border-neutral-800 shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={28} />
      </button>
      {MobileDrawer}
      {DesktopNav}
      <main className="flex-1 overflow-auto">{renderMainContent()}</main>
      {MobileFooter}
    </div>
  );
}