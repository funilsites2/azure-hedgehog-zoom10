import React, { useState } from "react";
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
    <div className="min-h-screen bg-neutral-900 text-white p-8">
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
    </div>
  );
};

export default Perfil;