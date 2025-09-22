import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  BarChart2,
  Award,
  Lock,
  Menu as MenuIcon,
  X as CloseIcon,
  User as UserIcon,
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
  { key: "modulos", label: "Módulos", icon: BookOpen, to: "/aluno" },
  { key: "progresso", label: "Progresso", icon: BarChart2, to: "/aluno" },
  { key: "conquistas", label: "Conquistas", icon: Award, to: "/aluno" },
  { key: "bloqueados", label: "Bloqueados", icon: Lock, to: "/aluno" },
] as const;

const Perfil: React.FC = () => {
  const { bannerUrl } = useBanner();
  const { logoUrl } = useLogo();
  const { photoUrl } = usePhoto();
  const { name, setName } = useUser();

  const [nomeAluno, setNomeAluno] = useState(name);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <CloseIcon size={28} className="text-green-500" />
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
            <Link
              key={item.key}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-green-600 hover:text-white rounded"
            >
              <item.icon size={20} className="text-green-500" />
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            to="/perfil"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:bg-green-600 hover:text-white rounded"
          >
            <UserIcon size={20} className="text-green-500" />
            <span>Perfil</span>
          </Link>
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
          <Link
            key={item.key}
            to={item.to}
            className="flex items-center gap-3 px-4 py-3 w-full text-neutral-300 hover:bg-green-600 hover:text-white rounded"
          >
            <item.icon size={20} className="text-green-500" />
            <span>{item.label}</span>
          </Link>
        ))}
        <Link
          to="/perfil"
          className="flex items-center gap-3 px-4 py-3 w-full text-neutral-300 hover:bg-green-600 hover:text-white rounded"
        >
          <UserIcon size={20} className="text-green-500" />
          <span>Perfil</span>
        </Link>
      </nav>
    </aside>
  );

  const MobileFooter = (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden bg-neutral-950 border-t border-neutral-800 h-16">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.key}
          to={item.to}
          className="flex-1 flex flex-col items-center justify-center text-neutral-300 hover:bg-green-600 hover:text-white"
        >
          <item.icon size={22} className="text-green-500" />
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
      <Link
        to="/perfil"
        className="flex-1 flex flex-col items-center justify-center text-neutral-300 hover:bg-green-600 hover:text-white"
      >
        <UserIcon size={22} className="text-green-500" />
        <span className="text-xs">Perfil</span>
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-neutral-900 text-white relative">
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-neutral-950 rounded-full p-2 border border-neutral-800 shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
      >
        <MenuIcon size={28} className="text-green-500" />
      </button>
      {MobileDrawer}
      {DesktopSidebar}
      <div className="flex-1 flex flex-col pt-12 md:pt-0">
        {bannerUrl && (
          <div className="mb-6 mx-auto w-full max-w-[1600px] h-[200px] md:h-[400px] overflow-hidden rounded-lg">
            <img
              src={bannerUrl}
              alt="Banner Aluno"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <main className="flex-1 overflow-auto p-8 pb-[84px] md:pb-5">
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
        {MobileFooter}
        <Footer />
      </div>
    </div>
  );
};

export default Perfil;