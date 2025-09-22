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
import { useUser } from "@/context/UserContext";
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
  const { name, setName } = useUser();
  const [nomeAluno, setNomeAluno] = useState(name);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleNameChange = () => {
    if (!nomeAluno.trim()) {
      showError("O nome não pode ficar vazio");
      return;
    }
    setName(nomeAluno.trim());
    showSuccess("Nome atualizado com sucesso");
  };

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

  // ... MobileDrawer, DesktopSidebar, MobileFooter idem às alterações anteriores ...

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      {/* botão mobile menu */}
      {/* MobileDrawer */}
      {/* DesktopSidebar */}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        <main className="flex-1 overflow-auto pb-[84px] md:pb-5 p-8">
          <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Perfil do Aluno</h1>
            <PhotoSettings />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Editar Nome</h2>
              <input
                type="text"
                className="w-full p-2 rounded bg-neutral-800 text-white"
                value={nomeAluno}
                onChange={(e) => setNomeAluno(e.target.value)}
              />
              <Button className="w-full" onClick={handleNameChange}>
                Salvar Nome
              </Button>
            </div>
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
        {/* MobileFooter */}
        <Footer />
      </div>
    </div>
  );
};

export default Perfil;