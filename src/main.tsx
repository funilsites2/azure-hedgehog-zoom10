import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { ModulosProvider } from "@/context/ModulosContext";

createRoot(document.getElementById("root")!).render(
  <ModulosProvider>
    <App />
  </ModulosProvider>
);