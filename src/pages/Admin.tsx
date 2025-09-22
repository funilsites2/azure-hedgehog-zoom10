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
import { SettingsForm } from "@/components/SettingsForm";
import { Footer } from "@/components/Footer";

export default function Admin() {
  // ... existing code unchanged ...

  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-white flex">
        <aside className="w-80 bg-neutral-950 p-6 flex-shrink-0">
          {/* ... new module & aula forms ... */}
          <BannerSettings />
          <SettingsForm />
        </aside>
        {/* ... rest unchanged ... */}
      </div>
      <Footer />
    </>
  );
}