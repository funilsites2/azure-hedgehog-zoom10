import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ModulosProvider } from "@/context/ModulosContext";
import { SettingsProvider } from "@/context/SettingsContext";

createRoot(document.getElementById("root")!).render(
  <BannerProvider>
    <ModulosProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </ModulosProvider>
  </BannerProvider>
);