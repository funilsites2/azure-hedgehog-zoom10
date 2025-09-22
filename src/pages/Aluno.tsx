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
import { usePhoto } from "@/context/PhotoContext";
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
  const { photoUrl } = usePhoto();
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<typeof MENU_ITEMS[number]["key"]>(
    "modulos"
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));
  const totalAulas = modulos.reduce((sum, m) => sum + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (sum, m) => sum + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas ? Math.round((aulasAssistidas / totalAulas) * 100) : 0;
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
      }
      if (modulo.bloqueado) {
        setModuloSelecionado(null);
        return null;
      }
      return (
        <>
          <button
            className="relative z-50 mb-6 mt-8 ml-8 flex items-center gap-2 text-neutral-400 hover:text-white transition"
            onClick={() => setModuloSelecionado(null)}
          >
            <ArrowLeft size={20} /> Voltar
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

  const MobileDrawer = (
    <div
      className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setMobileMenuOpen(false)}
    >
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-neutral-950 p-6 flex flex-col gap-6 border-r border-neutral-800 shadow-lg transition-transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="self-end text-neutral-400 hover:text-white"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={28} />
        </button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layers size={28} /> Aluno
        </h2>
        <nav className="flex flex-col gap-4">
          {MENU_ITEMS.map((item) => (
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
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const DesktopSidebar = (
    <aside
      className={`hidden md:flex flex-col bg-neutral-950 border-r border-neutral-800 transition-all ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex flex-col items-center space-y-4">
        {logoUrl && (
          <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
        )}
        <img
          src={photoUrl || "/placeholder.svg"}
          alt="Foto do aluno"
          className="w-16 h-16 rounded-full border-2 border-green-500"
        />
      </div>
      <div className="flex items-center justify-between p-4">
        {!sidebarCollapsed && (
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers size={24} /> Aluno
          </h2>
        )}
        <button
          className="p-2 text-neutral-400 hover:text-white"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="flex flex-col flex-1 p-2">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`flex items-center gap-2 w-full px-3 py-2 my-1 rounded text-sm font-medium transition-colors ${
              mobileTab === item.key
                ? "bg-neutral-900 text-white"
                : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
            }`}
            onClick={() => {
              setMobileTab(item.key);
              setModuloSelecionado(null);
            }}
          >
            <item.icon size={20} />
            {!sidebarCollapsed && item.label}
          </button>
        ))}
      </nav>
    </aside>
  );

  const MobileFooter = (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden bg-neutral-950 border-t border-neutral-800 h-16">
      {MENU_ITEMS.map((item) => (
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
          <item.icon size={22} />
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-neutral-950 rounded-full p-2 border border-neutral-800 shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={28} />
      </button>
      {MobileDrawer}
      {DesktopSidebar}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        <main className="flex-1 overflow-auto pb-[84px] md:pb-5">
          {bannerUrl && (
            <div className="mb-6 mx-auto w-full max-w-[1600px] h-[200px] md:h-[400px] overflow-hidden rounded-lg">
              <img
                src={bannerUrl}
                alt="Banner Aluno"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {renderMainContent()}
        </main>
        {MobileFooter}
        <Footer />
      </div>
    </div>
  );
}