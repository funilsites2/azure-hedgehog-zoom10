import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layers, User } from "lucide-react";
import { PhotoSettings } from "@/components/PhotoSettings";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";

const Perfil: React.FC = () => {
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
    // stub: in real app, call API here
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    showSuccess("Senha alterada com sucesso");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Menu igual à página principal */}
      <div className="text-center mb-8 p-8">
        <h1 className="text-4xl font-bold mb-4">Área de Membros</h1>
        <p className="text-xl text-neutral-400 mb-8">
          Plataforma inspirada em Netflix, Astron Members, The Members e Hotmart.
        </p>
        <div className="flex gap-6 justify-center">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
          >
            <Layers size={22} /> Área do Admin
          </Link>
          <Link
            to="/aluno"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            <User size={22} /> Área do Aluno
          </Link>
        </div>
      </div>

      {/* Conteúdo de Perfil */}
      <div className="p-8 max-w-md mx-auto space-y-8">
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
    </div>
  );
};

export default Perfil;