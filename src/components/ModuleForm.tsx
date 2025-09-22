"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type AulaInput = { titulo: string; videoUrl: string };

interface ModuleFormProps {
  initialNome?: string;
  initialCapa?: string;
  initialLinha?: string;
  initialAulas?: AulaInput[];
  onSubmit: (nome: string, capa: string, aulas: AulaInput[], linha: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({
  initialNome = "",
  initialCapa = "",
  initialLinha = "",
  initialAulas = [],
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}) => {
  const [nome, setNome] = useState(initialNome);
  const [capa, setCapa] = useState(initialCapa);
  const [linha, setLinha] = useState(initialLinha);
  const [aulas, setAulas] = useState<AulaInput[]>(initialAulas);
  const [novaAula, setNovaAula] = useState<AulaInput>({ titulo: "", videoUrl: "" });

  const addAula = () => {
    if (!novaAula.titulo || !novaAula.videoUrl) return;
    setAulas((prev) => [...prev, novaAula]);
    setNovaAula({ titulo: "", videoUrl: "" });
  };

  const removeAula = (idx: number) => {
    setAulas((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!nome.trim() || !capa.trim() || !linha.trim()) return;
    onSubmit(nome, capa, aulas, linha);
    setNome("");
    setCapa("");
    setLinha("");
    setAulas([]);
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full p-2 rounded bg-neutral-800 text-white"
        placeholder="Nome do módulo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        className="w-full p-2 rounded bg-neutral-800 text-white"
        placeholder="URL da capa"
        value={capa}
        onChange={(e) => setCapa(e.target.value)}
      />
      <input
        className="w-full p-2 rounded bg-neutral-800 text-white"
        placeholder="Nome da linha"
        value={linha}
        onChange={(e) => setLinha(e.target.value)}
      />
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded bg-neutral-800 text-white"
            placeholder="Título da aula"
            value={novaAula.titulo}
            onChange={(e) => setNovaAula((a) => ({ ...a, titulo: e.target.value }))}
          />
          <input
            className="flex-1 p-2 rounded bg-neutral-800 text-white"
            placeholder="URL do vídeo"
            value={novaAula.videoUrl}
            onChange={(e) => setNovaAula((a) => ({ ...a, videoUrl: e.target.value }))}
          />
          <Button type="button" onClick={addAula}>
            <Plus size={16} />
          </Button>
        </div>
        <ul className="space-y-1">
          {aulas.map((a, idx) => (
            <li key={idx} className="flex items-center justify-between bg-neutral-800 p-2 rounded">
              <span className="truncate">{a.titulo}</span>
              <button onClick={() => removeAula(idx)}>
                <Trash2 className="text-red-400" size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit}>{submitLabel}</Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
};