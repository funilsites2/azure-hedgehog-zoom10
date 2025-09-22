import { useState } from "react";
import {
  Menu,
  X,
  ArrowLeft,
  BookOpen,
  BarChart2,
  Award,
  Lock,
  CheckCircle,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import SimpleProgress from "@/components/SimpleProgress";
import { useModulos } from "@/context/ModulosContext";
import { AulaPlayer } from "@/components/AulaPlayer";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useBanner } from "@/context/BannerContext";
import { useLogo } from "@/context/LogoContext";
import { usePhoto } from "@/context/PhotoContext";
import { useUser } from "@/context/UserContext";
import { Footer } from "@/components/Footer";
import { showSuccess } from "@/utils/toast";
import { useStudentTheme } from "@/context/StudentThemeContext";

export default function Aluno() {
  const { backgroundColor } = useStudentTheme();
  // ... restante do hook

  return (
    <div
      className="min-h-screen w-screen flex flex-col md:flex-row text-white relative bg-[var(--background-color)]"
      style={{ "--background-color": backgroundColor } as any}
    >
      {/* ... resto igual */}
    </div>
  );
}