import React from "react";
import { Link } from "react-router-dom";
import { useModulos } from "@/context/ModulosContext";
import { ModuloCarousel } from "@/components/ModuloCarousel";
import { useStudentTheme } from "@/context/StudentThemeContext";

export default function Aluno() {
  const { backgroundColor, buttonColor } = useStudentTheme();
  const { modulos } = useModulos();

  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ backgroundColor }}
    >
      <header className="flex justify-between items-center p-4 bg-neutral-900">
        <h1 className="text-2xl font-bold">Área do Aluno</h1>
        <nav className="flex gap-2">
          <Link
            to="/"
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: buttonColor }}
          >
            Início
          </Link>
          <Link
            to="/perfil"
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: buttonColor }}
          >
            Perfil
          </Link>
        </nav>
      </header>

      <main className="flex-1 p-4">
        <ModuloCarousel
          modulos={modulos}
          alunoLayout={true}
          showLocked={false}
          onModuloClick={() => {}}
        />
      </main>
    </div>
  );
}