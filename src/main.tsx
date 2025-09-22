import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ModulosProvider } from "@/context/ModulosContext";
import { LogoProvider } from "@/context/LogoContext";
import { PhotoProvider } from "@/context/PhotoContext";
import { UserProvider } from "@/context/UserContext";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <LogoProvider>
      <BannerProvider>
        <ModulosProvider>
          <PhotoProvider>
            <App />
          </PhotoProvider>
        </ModulosProvider>
      </BannerProvider>
    </LogoProvider>
  </UserProvider>
);