import { useState } from "react";
import {
  Layers,
  ArrowLeft,
  BookOpen,
  BarChart2,
  Award,
  Lock,
  Menu,
  X,
  User,
  CheckCircle,
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
              if (!mods.length) return null;
              return (
                <div key={linha}>
                  <h3 className="text-2xl font-semibold mb-4">{linha}</h3>
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
            className="mb-6 mt-8 ml-4 flex items-center gap-2 text-neutral-400 hover:text-white transition"
            onClick={() => setModuloSelecionado(null)}
          >
            <ArrowLeft size={20} /> Voltar
          </button>
          <div className="flex-1 flex overflow-hidden">
            <AulaPlayer
              modulo={modulo}
              aulaSelecionadaId={aulaSelecionada ?? modulo.aulas[0]?.id}
              onSelecionarAula={setAulaSelecionada}
              onMarcarAssistida={(id) => marcarAulaAssistida(modulo.id, id)}
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

  // ... o resto do componente permanece igual (menus, sidebar, footer)
  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      {/* Mobile Drawer e DesktopSidebar idênticos à área de Aluno */}
      {/* ... */}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {bannerUrl && moduloSelecionado === null && (
          <div className="mb-6 mx-auto w-full max-w-[1600px] h-[200px] md:h-[400px] overflow-hidden rounded-lg">
            <img
              src={bannerUrl}
              alt="Banner Aluno"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 overflow-auto pb-[84px] md:pb-5">
          {renderMainContent()}
        </div>
        {/* MobileFooter e Footer */}
      </div>
    </div>
  );
}