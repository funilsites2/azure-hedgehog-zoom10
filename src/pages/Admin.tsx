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
import { ThemeSettings } from "@/components/ThemeSettings";
import { Footer } from "@/components/Footer";

export default function Admin() {
  const {
    modulos,
    adicionarModulo,
    adicionarAula,
    editarModulo,
    setAulaReleaseDays,
    duplicarModulo,
  } = useModulos();

  // ... restante inalterado

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0 space-y-6">
          <LogoSettings />
          <BannerSettings />
          <ThemeSettings />

          <div>
            <h3 className="font-semibold mb-2">Novo Módulo</h3>
            {/* ... */}
          </div>
          {/* ... restante */}
        </aside>

        {/* ... */}
      </div>
      <Footer />
    </>
  );
}