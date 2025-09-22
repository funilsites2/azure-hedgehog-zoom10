import { useState } from "react";
import {
  Layers,
  Edit,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModulos } from "@/context/ModulosContext";
import { ModuleForm } from "@/components/ModuleForm";
import { BannerSettings } from "@/components/BannerSettings";
import { LogoSettings } from "@/components/LogoSettings";
import { Footer } from "@/components/Footer";
import { useStudentTheme } from "@/context/StudentThemeContext";

export default function Admin() {
  const {
    modulos,
    adicionarModulo,
    adicionarAula,
    editarModulo,
    setAulaReleaseDays,
    duplicarModulo,
  } = useModulos();

  const {
    backgroundColor,
    buttonColor,
    progressColor,
    setBackgroundColor,
    setButtonColor,
    setProgressColor,
  } = useStudentTheme();

  // ... restante do Admin (mesmo)

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0 space-y-6">
          <LogoSettings />
          <BannerSettings />
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Tema Área do Aluno</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="w-32">Fundo:</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-32">Botões:</label>
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-32">Progresso:</label>
                <input
                  type="color"
                  value={progressColor}
                  onChange={(e) => setProgressColor(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Novo Módulo</h3>
            <ModuleForm
              onSubmit={(nome, capa, aulas, linha, delayDays) =>
                adicionarModulo(nome, capa, aulas, linha, delayDays)
              }
              submitLabel="Adicionar Módulo"
            />
          </div>
          {/* ... resto intacto */}
        </aside>
        {/* ... main */}
      </div>
      <Footer />
    </>
  );
}