import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ModulosProvider } from "@/context/ModulosContext";
import { StudentSettingsProvider } from "@/context/StudentSettingsContext";

createRoot(document.getElementById("root")!).render(
  <BannerProvider>
    <ModulosProvider>
      <StudentSettingsProvider>
        <App />
      </StudentSettingsProvider>
    </ModulosProvider>
  </BannerProvider>
);