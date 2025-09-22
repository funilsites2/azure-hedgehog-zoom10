import { useState } from "react";
import {
  Plus,
  Video,
  Layers,
  Trash2,
  Edit,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModulos } from "@/context/ModulosContext";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { ModuleForm } from "@/components/ModuleForm";
import { BannerSettings } from "@/components/BannerSettings";
import { AdminMenuSettings } from "@/components/AdminMenuSettings";
import { Footer } from "@/components/Footer";

export default function Admin() {
  const {
    modulos,
    adicionarModulo,
    adicionarAula,
    editarModulo,
    setModuloBloqueado,
    setAulaBloqueada,
  } = useModulos();

  // ... existing state and handlers

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0">
          <h3 className="font-semibold mb-4">Novo Módulo</h3>
          <ModuleForm
            onSubmit={(nome, capa, aulas, linha) =>
              adicionarModulo(nome, capa, aulas, linha)
            }
            submitLabel="Adicionar Módulo"
          />
          <div className="mt-8">
            <h3 className="font-semibold mb-2">
              Nova Aula em Módulo Existente
            </h3>
            {/* existing aula settings */}
          </div>
          <BannerSettings />
          <AdminMenuSettings />
        </aside>
        <main className="flex-1 p-8 overflow-auto pb-16 md:pb-5">
          {/* existing main content */}
        </main>
      </div>
      <Footer />
    </>
  );
}