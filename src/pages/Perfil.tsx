import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  BookOpen,
  BarChart2,
  Award,
  Lock,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useBanner } from "@/context/BannerContext";
import { useLogo } from "@/context/LogoContext";
import { usePhoto } from "@/context/PhotoContext";
import { PhotoSettings } from "@/components/PhotoSettings";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { Footer } from "@/components/Footer";

const MENU_ITEMS = [
  { key: "modulos", label: "Módulos", icon: BookOpen },
  { key: "progresso", label: "Progresso", icon: BarChart2 },
  { key: "conquistas", label: "Conquistas", icon: Award },
  { key: "bloqueados", label: "Bloqueados", icon: Lock },
] as const;

const Perfil: React.FC = () => {
  const { bannerUrl } = useBanner();
  const { logoUrl } = useLogo();
  const { photoUrl } = usePhoto();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handlePasswordChange = () => {
    if (!currentPwd || !newPwd) {
      showError("Preencha todos os campos");
      return;
    }
    if (newPwd !== confirmPwd) {
      showError("As senhas não conferem");
      return;
    }
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    showSuccess("Senha alterada com sucesso");
  };

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
        >
          <X size={28} />
        </button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layers size={28} /> Área do Aluno
        </h2>
        <nav className="flex flex-col gap-4">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.key === "modulos" ? "/aluno" : "#"}
              className="flex items-center gap-2 px-2 py-2 rounded text-neutral-300 hover:bg-neutral-800 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon size={20} /> {item.label}
            </Link>
          ))}
          <Link
            to="/perfil"
            className="flex items-center gap-2 px-2 py-2 rounded text-neutral-300 hover:bg-neutral-800 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={20} /> Perfil
          </Link>
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
        {logoUrl && <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />}
        <img
          src={photoUrl || "/placeholder.svg"}
          alt="Foto do aluno"
          className="w-16 h-16 rounded-full border-2 border-green-500"
        />
      </div>
      <div className="flex items-center justify-between p-4">
        {!sidebarCollapsed && (
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers size={24} /> Área do Aluno
          </h2>
        )}
        <button
          className="p-2 text-neutral-400 hover:text-white"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
        >
          {sidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="flex flex-col flex-1 p-2">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.key}
            to={item.key === "modulos" ? "/aluno" : "#"}
            className="flex items-center gap-2 w-full px-3 py-2 my-1 rounded text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <item.icon size={20} />
            {!sidebarCollapsed && item.label}
          </Link>
        ))}
        <Link
          to="/perfil"
          className="flex items-center gap-2 w-full px-3 py-2 my-1 rounded text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <User size={20} />
          {!sidebarCollapsed && "Perfil"}
        </Link>
      </nav>
    </aside>
  );

  const MobileFooter = (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden bg-neutral-950 border-t border-neutral-800 h-16">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.key}
          to={item.key === "modulos" ? "/aluno" : "#"}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-xs text-neutral-300 hover:text-white"
        >
          <item.icon size={22} />
          {item.label}
        </Link>
      ))}
      <Link
        to="/perfil"
        className="flex-1 flex flex-col items-center justify-center gap-1 text-xs text-neutral-300 hover:text-white"
      >
        <User size={22} />
        Perfil
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-neutral-950 rounded-full p-2 border border-neutral-800 shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu size={28} />
      </button>
      {MobileDrawer}
      {DesktopSidebar}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        <main className="flex-1 overflow-auto pb-[84px] md:pb-5 p-8">
          <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Perfil do Aluno</h1>
            <PhotoSettings />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Alterar Senha</h2>
              <input
                type="password"
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="Senha atual"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
              <input
                type="password"
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="Nova senha"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
              <input
                type="password"
                className="w-full p-2 rounded bg-neutral-800 text-white"
                placeholder="Confirme a nova senha"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
              <Button className="w-full" onClick={handlePasswordChange}>
                Atualizar Senha
              </Button>
            </div>
          </div>
        </main>
        {MobileFooter}
        <Footer />
      </div>
    </div>
  );
};

export default Perfil;