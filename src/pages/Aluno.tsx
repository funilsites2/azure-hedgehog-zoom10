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
} from "lucide-react";
import { Link } from "react-router-dom";
import SimpleProgress from "@/components/SimpleProgress";
import ContinueWatchingCarousel from "@/components/ContinueWatchingCarousel";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useBanner } from "@/context/BannerContext";
import { useLogo } from "@/context/LogoContext";
import { usePhoto } from "@/context/PhotoContext";
import { useUser } from "@/context/UserContext";
import { Footer } from "@/components/Footer";
import { showSuccess } from "@/utils/toast";

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
    .filter(({ aula }) => !aula.assistida);

  // ... restante dos hooks e funções omitidos para brevidade ...

  function renderMainContent() {
    if (mobileTab === "modulos" && !moduloSelecionado) {
      return (
        <>
          {partialAulas.length > 0 && (
            <div className="mx-4 mt-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Continuar Assistindo
              </h2>
              <ContinueWatchingCarousel
                items={partialAulas}
                onSelect={(modId, aulaId) => {
                  setModuloSelecionado(modId);
                  setAulaSelecionada(aulaId);
                }}
              />
            </div>
          )}
          <div className="mx-4 space-y-6">
            {/* ... módulos por linha ... */}
          </div>
        </>
      );
    }
    // ... resto do conteúdo inalterado ...
  }

  // ... JSX de retorno ...
}