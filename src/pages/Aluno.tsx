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
import { Progress } from "@/components/ui/progress";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useBanner } from "@/context/BannerContext";
import { useLogo } from "@/context/LogoContext";
import { usePhoto } from "@/context/PhotoContext";
import { useUser } from "@/context/UserContext";
import { Footer } from "@/components/Footer";

function getYoutubeThumbnail(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "/placeholder.svg";
}

const MENU_ITEMS = [
  { key: "continuar", label: "Continuar", icon: Play },
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

  // lista de todas as aulas não concluídas
  const partialAulas = modulos
    .flatMap((m) => m.aulas.map((a) => ({ modulo: m, aula: a })))
    .filter(({ aula }) => !aula.assistida);

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

  function renderMainContent() {
    if (moduloSelecionado && modulo) {
      return (
        <AulaPlayer
          modulo={modulo}
          aulaSelecionadaId={aulaSelecionada ?? modulo.aulas[0].id}
          onSelecionarAula={(id) => setAulaSelecionada(id)}
          onMarcarAssistida={(id) => marcarAulaAssistida(moduloSelecionado, id)}
        />
      );
    }
    if (mobileTab === "modulos") {
      return (
        <div>
          {linhas.map((linha) => {
            const mods = modulos.filter((m) => m.linha === linha);
            if (mods.length === 0) return null;
            return (
              <div key={linha} className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">{linha}</h3>
                <ModuloCarousel
                  modulos={mods}
                  onModuloClick={(m) => {
                    setModuloSelecionado(m.id);
                    setAulaSelecionada(m.aulas[0]?.id ?? null);
                  }}
                  alunoLayout
                />
              </div>
            );
          })}
        </div>
      );
    }
    // demais abas (progresso, conquistas, bloqueados) podem ser implementadas aqui
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        <p>Em breve nesta seção ({mobileTab}).</p>
      </div>
    );
  }

  const MobileDrawer = (
    <div
      className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
          <X size={28} />
        </button>
        <div className="flex flex-col items-center space-y-4">
          {logoUrl && <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />}
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
                setMobileTab(item.key);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 w-full text-neutral-300 hover:bg-green-600 hover:text-white rounded ${
                mobileTab === item.key ? "bg-green-700 text-white" : ""
              }`}
            >
              <item.icon size={20} className="text-green-500" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const DesktopSidebar = (
    <aside className="hidden md:flex flex-col items-center bg-neutral-950 p-6 space-y-6">
      {logoUrl && <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />}
      <img
        src={photoUrl || "/placeholder.svg"}
        alt="Foto do aluno"
        className="w-16 h-16 rounded-full border-2 border-green-500"
      />
      <h2 className="text-xl font-bold text-white">{name}</h2>
      <nav className="flex flex-col space-y-2 w-full">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setMobileTab(item.key)}
            className={`flex items-center gap-3 px-4 py-3 w-full text-neutral-300 hover:bg-green-600 hover:text-white rounded ${
              mobileTab === item.key ? "bg-green-700 text-white" : ""
            }`}
          >
            <item.icon size={20} className="text-green-500" />
            <span>{item.label}</span>
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
          onClick={() => setMobileTab(item.key)}
          className={`flex-1 flex flex-col items-center justify-center text-neutral-300 hover:bg-green-600 hover:text-white ${
            mobileTab === item.key ? "bg-green-700 text-white" : ""
          }`}
        >
          <item.icon size={22} className="text-green-500" />
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-neutral-950 rounded-full p-2 border border-neutral-800 shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu size={28} className="text-green-500" />
      </button>
      {MobileDrawer}
      {DesktopSidebar}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {bannerUrl && moduloSelecionado === null && mobileTab === "modulos" && (
          <div className="mx-4 my-4 flex justify-center">
            <div className="w-full max-w-[1600px] h-[400px] overflow-hidden rounded-lg">
              <img
                src={bannerUrl}
                alt="Banner Aluno"
                className="w-full h-full object-cover object-left"
              />
            </div>
          </div>
        )}

        {/* seção Continuar Assistindo com todas as aulas não concluídas */}
        {moduloSelecionado === null && mobileTab === "continuar" && partialAulas.length > 0 && (
          <div className="container mx-auto mb-8">
            <h3 className="text-2xl font-semibold mb-4">Continuar Assistindo</h3>
            <div className="flex overflow-x-auto gap-6 pb-2">
              {partialAulas.map(({ modulo: m, aula: a }) => (
                <div
                  key={`${m.id}-${a.id}`}
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setModuloSelecionado(m.id);
                    setAulaSelecionada(a.id);
                  }}
                >
                  <img
                    src={getYoutubeThumbnail(a.videoUrl)}
                    alt={a.titulo}
                    className="w-56 h-auto rounded-lg"
                  />
                  <p className="mt-2 text-lg font-medium">{m.nome}</p>
                  <p className="text-neutral-300 truncate">{a.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto pb-[84px] md:pb-5">
          {renderMainContent()}
        </div>

        {MobileFooter}
        <Footer />
      </div>
    </div>
  );
}