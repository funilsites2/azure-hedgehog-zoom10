import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ModulosProvider } from "@/context/ModulosContext";

createRoot(document.getElementById("root")!).render(
  <BannerProvider>
    <ModulosProvider>
      <App />
    </ModulosProvider>
  </BannerProvider>
);