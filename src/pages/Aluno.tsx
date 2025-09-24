import { useState } from "react";
import {
  Menu,
  X,
  ArrowLeft,
  BookOpen,
  BarChart2,
  Award,
  Lock,
  CheckCircle,
  User,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import SimpleProgress from "@/components/SimpleProgress";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useBanner } from "@/context/BannerContext";
import { useLogo } from "@/context/LogoContext";
import { usePhoto } from "@/context/PhotoContext";
import { useUser } from "@/context/UserContext";
import { Footer } from "@/components/Footer";
import { showSuccess } from "@/utils/toast";
import "@/styles/no-scrollbar.css";
import GamificationMap from "@/components/GamificationMap";

function getYoutubeThumbnail(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : "/placeholder.svg";
}

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
  const { name } = useUser();

  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<typeof MENU_ITEMS[number]["key"]>(
    "modulos"
  );

  const now = Date.now();

  const partialAulas = modulos
    .flatMap((m) => m.aulas.map((a) => ({ modulo: m, aula: a })))
    .filter(({ aula }) => !aula.assistida && !!aula.started);

  const linhas = Array.from(new Set(modulos.map((m) => m.linha)));
  const totalAulas = modulos.reduce((sum, m) => sum + m.aulas.length, 0);
  const aulasAssistidas = modulos.reduce(
    (sum, m) => sum + m.aulas.filter((a) => a.assistida).length,
    0
  );
  const progresso = totalAulas
    ? Math.round((aulasAssistidas / totalAulas) * 100)
    : 0;
  const modulo = modulos.find((m) => m.id === moduloSelecionado);

  // Aula atual e descrição
  const selectedAulaId = aulaSelecionada ?? (modulo?.aulas[0]?.id ?? null);
  const aulaAtual = modulo ? modulo.aulas.find((a) => a.id === selectedAulaId) : null;
  const descricaoAula = (aulaAtual && (aulaAtual as any).descricao) as string | undefined;

  const handleMarcar = (aulaId: number) => {
    if (!modulo) return;
    marcarAulaAssistida(modulo.id, aulaId);
    const idx = modulo.aulas.findIndex((a) => a.id === aulaId);
    const next = modulo.aulas[idx + 1];
    showSuccess(
      `Aula concluída!${
        next ? ` "${next.titulo}" desbloqueada.` : " Módulo concluído!"
      }`
    );
  };

  function renderMainContent() {
    if (mobileTab === "modulos") {
      if (!modulo) {
        return (
          <>
            <div className="mx-4 space-y-6">
              {linhas.map((linha) => {
                const mods = modulos.filter((m) => m.linha === linha);
                if (!mods.length) return null;
                return (
                  <div key={linha}>
                    <h3 className="text-2xl font-semibold mb-4 text-white">
                      {linha}
                    </h3>
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
      if (modulo.bloqueado) {
        setModuloSelecionado(null);
        return null;
      }
      return (
        <>
          <div className="flex items-center gap-2 mb-6 mt-8 ml-4 md:mt-8">
            <button
              className="flex items-center gap-2 text-neutral-300 hover:text-white transition"
              onClick={() => setModuloSelecionado(null)}
            >
              <ArrowLeft size={20} /> Voltar
            </button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <AulaPlayer
              modulo={modulo}
              aulaSelecionadaId={aulaSelecionada ?? modulo.aulas[0]?.id}
              onSelecionarAula={setAulaSelecionada}
              onMarcarAssistida={handleMarcar}
              belowVideo={
                <div className="mt-3">
                  <h1 className="text-2xl font-bold">{modulo.nome}</h1>
                  {descricaoAula ? (
                    <p className="text-sm md:text-base text-neutral-300 mt-2">
                      {descricaoAula}
                    </p>
                  ) : null}
                </div>
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
          <SimpleProgress value={progresso} />
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

          <GamificationMap
            progresso={progresso}
            totalAulas={totalAulas}
            aulasAssistidas={aulasAssistidas}
          />

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Conquistas</h3>
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
        mobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setMobileMenuOpen(false)}
    >
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-neutral-950/90 backdrop-blur-sm p-6 flex flex-col gap-6 transition-transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="self-end text-neutral-400 hover:text-white"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={28} className="text-green-500" />
        </button>
        <div className="flex flex-col items-center space-y-4">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
          )}
          <img
            src={photoUrl || "/placeholder.svg"}
            alt="Foto do aluno"
            className="w-16 h-16 rounded-full border-2 border-green-500"
          />
          <h2 className="text-xl font-bold text-white">{name}</h2>
        </div>
        <nav className="flex flex-col mt-4 space-y-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileTab(item.key);
                if (item.key === "modulos") setModuloSelecionado(null);
              }}
              className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-green-600 hover:text-white rounded text-left"
            >
              <item.icon size={20} className="text-green-500" />
              <span>{item.label}</span>
            </button>
          ))}
          <Link
            to="/perfil"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-green-600 hover:text-white rounded"
          >
            <User size={20} className="text-green-500" />
            <span className="text-xs">Perfil</span>
          </Link>
        </nav>
      </div>
    </div>
  );

  const DesktopSidebar = (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 z-30 flex-col items-center bg-neutral-950 p-6 space-y-6 border-r border-neutral-800">
      {logoUrl && (
        <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
      )}
      <img
        src={photoUrl || "/placeholder.svg"}
        alt="Foto do aluno"
        className="w-16 h-16 rounded-full border-2 border-green-500"
      />
      <div className="w-full">
        <SimpleProgress value={progresso} />
        <div className="text-xs text-neutral-300 mt-1">
          {progresso}% concluído
        </div>
      </div>
      <nav className="flex flex-col space-y-2 w-full">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setMobileTab(item.key);
              if (item.key === "modulos") setModuloSelecionado(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 w-full text-neutral-300 rounded ${
              mobileTab === item.key
                ? "bg-green-600 text-white"
                : "hover:bg-green-600 hover:text-white"
            }`}
          >
            <item.icon size={20} className="text-green-500" />
            <span>{item.label}</span>
          </button>
        ))}
        <Link
          to="/perfil"
          className="flex items-center gap-3 px-4 py-3 w-full text-neutral-300 hover:bg-green-600 hover:text-white rounded"
        >
          <User size={20} className="text-green-500" />
          <span>Perfil</span>
        </Link>
      </nav>
    </aside>
  );

  // Header móvel transparente com burger e logo sobre o fundo
  const MobileHeader = (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-30 flex items-center px-4">
      <button
        className="rounded-full p-2 active:scale-95 transition"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={24} className="text-green-500" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
        ) : (
          <span className="text-sm font-semibold">Área de Membros</span>
        )}
      </div>
    </header>
  );

  const MobileFooter = (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden bg-neutral-950 border-t border-neutral-800 h-16">
      {MENU_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => {
            setMobileTab(item.key);
            if (item.key === "modulos") setModuloSelecionado(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center ${
            mobileTab === item.key
              ? "bg-green-600 text-white"
              : "text-neutral-300 hover:bg-green-600 hover:text-white"
          }`}
        >
          <item.icon size={22} className="text-green-500" />
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
      <Link
        to="/perfil"
        className="flex-1 flex flex-col items-center justify-center text-neutral-300 hover:bg-green-600 hover:text-white"
      >
        <User size={22} className="text-green-500" />
        <span className="text-xs">Perfil</span>
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      {MobileDrawer}
      {DesktopSidebar}
      {MobileHeader}
      <div className="flex-1 flex flex-col pt-14 md:pt-0 md:ml-64">
        {bannerUrl && moduloSelecionado === null && (
          <div className="mx-4 my-4 flex justify-center">
            <div className="relative w-full max-w-[1600px] h=[400px] md:h-[400px] h-[400px] overflow-hidden rounded-lg">
              <img
                src={bannerUrl}
                alt="Banner Aluno"
                className="w-full h-full object-cover object-left"
              />
            </div>
          </div>
        )}

        {moduloSelecionado === null && partialAulas.length > 0 && (
          <div className="mx-4 mt-4">
            <h2 className="text-2xl font-semibold mb-2 text-white">
              Continuar Assistindo
            </h2>
            <div>
              <div className="overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory flex gap-4 pb-2">
                {partialAulas.map(({ modulo: m, aula }) => {
                  let savedPct = 0;
                  try {
                    savedPct = Number(
                      localStorage.getItem(`aula_progress_pct_${aula.id}`) || "0"
                    );
                    if (!isFinite(savedPct) || savedPct < 0) savedPct = 0;
                    if (savedPct > 100) savedPct = 100;
                  } catch {
                    savedPct = 0;
                  }

                  return (
                    <div
                      key={aula.id}
                      className="group snap-start flex-shrink-0 w=[260px] md:w-[300px] rounded-lg md:rounded-xl overflow-hidden cursor-pointer transition flex flex-col"
                      onClick={() => {
                        setModuloSelecionado(m.id);
                        setAulaSelecionada(aula.id);
                      }}
                    >
                      <div className="relative w-full h-[130px] md:h-[160px] rounded-lg md:rounded-xl overflow-hidden transition-transform duration-300 ease-out group-hover:scale-95">
                        <img
                          src={getYoutubeThumbnail(aula.videoUrl)}
                          alt={aula.titulo}
                          className="w-full h-full object-cover rounded-lg md:rounded-xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                            <div className="bg-black/50 rounded-full p-2 ring-1 ring-white/20">
                              <Play size={28} className="text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-white text-sm font-medium truncate">
                              {aula.titulo}
                            </p>
                            <p className="text-neutral-200 text-xs truncate">
                              {m.nome}
                            </p>
                          </div>
                        </div>
                      </div>

                      {savedPct > 0 ? (
                        <div className="mt-2 px-1 pb-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <SimpleProgress value={savedPct} />
                            </div>
                            <span className="text-[10px] text-neutral-300 w-8 text-right">
                              {savedPct}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 px-2 pb-2">
                          <p className="text-xs text-neutral-300 truncate">
                            {aula.titulo}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto pb=[84px] md:pb-5">
          {renderMainContent()}
        </div>
        {MobileFooter}
        <Footer />
      </div>
    </div>
  );
}