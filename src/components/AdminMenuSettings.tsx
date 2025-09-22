"use client";

import React, { useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { Button } from "@/components/ui/button";

export const AdminMenuSettings: React.FC = () => {
  const { logoUrl, student, setLogo, setStudent } = useStudent();
  const [logoInput, setLogoInput] = useState(logoUrl || "");
  const [nameInput, setNameInput] = useState(student.name);
  const [imageInput, setImageInput] = useState(student.imageUrl);

  const handleLogoSave = () => {
    if (logoInput.trim()) {
      setLogo(logoInput.trim());
    }
  };

  const handleStudentSave = () => {
    setStudent({
      name: nameInput.trim(),
      imageUrl: imageInput.trim(),
    });
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Menu Settings</h3>
      <div className="flex flex-col gap-2 bg-neutral-800 p-4 rounded">
        <label className="text-sm">Logo URL</label>
        <input
          className="w-full p-2 rounded bg-neutral-700 text-white"
          placeholder="Logo URL"
          value={logoInput}
          onChange={(e) => setLogoInput(e.target.value)}
        />
        <Button onClick={handleLogoSave}>Salvar Logo</Button>
      </div>
      <div className="flex flex-col gap-2 bg-neutral-800 p-4 rounded mt-4">
        <label className="text-sm">Nome do Aluno</label>
        <input
          className="w-full p-2 rounded bg-neutral-700 text-white"
          placeholder="Nome do Aluno"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <label className="text-sm">Foto do Aluno URL</label>
        <input
          className="w-full p-2 rounded bg-neutral-700 text-white"
          placeholder="Foto do Aluno URL"
          value={imageInput}
          onChange={(e) => setImageInput(e.target.value)}
        />
        <Button onClick={handleStudentSave}>Salvar Dados do Aluno</Button>
      </div>
    </div>
);
}