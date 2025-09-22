import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ModulosProvider } from "@/context/ModulosContext";
import { LogoProvider } from "@/context/LogoContext";
import { PhotoProvider } from "@/context/PhotoContext";
import { StudentProvider } from "@/context/StudentContext";

createRoot(document.getElementById("root")!).render(
  <LogoProvider>
    <BannerProvider>
      <ModulosProvider>
        <PhotoProvider>
          <StudentProvider>
            <App />
          </StudentProvider>
        </PhotoProvider>
      </ModulosProvider>
    </BannerProvider>
  </LogoProvider>
);