"use client";

import React from "react";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="hidden md:flex justify-center items-center p-4 bg-neutral-950 text-neutral-400">
      <span>© {year} Área de Membros. Todos os direitos reservados.</span>
    </footer>
  );
};