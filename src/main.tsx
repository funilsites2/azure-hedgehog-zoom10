import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ModulosProvider } from "@/context/ModulosContext";
import { StudentProvider } from "@/context/StudentContext";

createRoot(document.getElementById("root")!).render(
  <BannerProvider>
    <ModulosProvider>
      <StudentProvider>
        <App />
      </StudentProvider>
    </ModulosProvider>
  </BannerProvider>
);