"use client";

import React, { useState } from "react";
import { useModulos } from "@/context/ModulosContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash2, Edit } from "lucide-react";

export type AulaInput = {
  id?: number;
  titulo: string;
  videoUrl: string;
  releaseDate?: number;
};

interface ModuleFormProps {
  initialNome?: string;
  initialCapa?: string;
  initialLinha?: string;
  initialAulas?: AulaInput[];
  initialDelayDays?: number;
  onSubmit: (
    nome: string,
    capa: string,
    aulas: AulaInput[],
    linha: string,
    delayDays: number
  ) => void;
  onCancel?: () => void;
  submitLabel?: string;
  onAulasChange?: (aulas: AulaInput[]) => void; // new prop to notify parent when aulas change
}

export const ModuleForm: React.FC<ModuleFormProps> = ({
  initialNome = "",
  initialCapa = "",
  initialLinha = "",
  initialAulas = [],
  initialDelayDays = 0,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  onAulasChange,
}) => {
  const { modulos } = useModulos();
  const existingLinhas = Array.from(
    new Set(modulos.map((m) => m.linha).filter((l) => l.trim() !== ""))
  );

  const [nome, setNome] = useState(initialNome);
  const [capa, setCapa] = useState(initialCapa);
  const [linha, setLinha] = useState(initialLinha);
  const [aulas, setAulas] = useState<AulaInput[]>(initialAulas);
  const [novaAula, setNovaAula] = useState<AulaInput>({ titulo: "", videoUrl: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreatingNewLinha, setIsCreatingNewLinha] = useState(false);
  const [delayDays, setDelayDays] = useState<number>(initialDelayDays);

  const notifyAulasChange = (nextAulas: AulaInput[]) => {
    try {
      onAulasChange?.(nextAulas);
    } catch {
      //
    }
  };

  const handleAddAula = () => {
    if (!novaAula.titulo.trim() || !novaAula.videoUrl.trim()) return;
    if (editingIndex !== null) {
      // Preserve id and releaseDate from the existing aula when updating
      setAulas((prev) => {
        const next = prev.map((a, i) => (i === editingIndex ? { ...a, ...novaAula } : a));
        notifyAulasChange(next);
        return next;
      });
      setEditingIndex(null);
    } else {
      setAulas((prev) => {
        const next = [...prev, novaAula];
        notifyAulasChange(next);
        return next;
      });
    }
    // Clear novaAula but remove any id/releaseDate to avoid accidental reuse
    setNovaAula({ titulo: "", videoUrl: "" });
  };

  const removeAula = (idx: number) => {
    setAulas((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      notifyAulasChange(next);
      return next;
    });
    if (editingIndex === idx) {
      setEditingIndex(null);
      setNovaAula({ titulo: "", videoUrl: "" });
    }
  };

  const editAula = (idx: number) => {
    setNovaAula(aulas[idx]);
    setEditingIndex(idx);
  };

  const handleSubmit = () => {
    if (!nome.trim() || !capa.trim() || !linha.trim()) return;
    onSubmit(nome, capa, aulas, linha, delayDays);
    setNome("");
    setCapa("");
    setLinha("");
    setAulas([]);
    setDelayDays(0);
    setIsCreatingNewLinha(false);
    setEditingIndex(null);
    setNovaAula({ titulo: "", videoUrl: "" });
    notifyAulasChange([]);
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
      <Select
        onValueChange={(value) => {
          if (value === "__new") {
            setIsCreatingNewLinha(true);
            setLinha("");
          } else {
            setIsCreatingNewLinha(false);
            setLinha(value);
          }
        }}
        value={isCreatingNewLinha ? "__new" : linha}
      >
        <SelectTrigger className="w-full bg-neutral-800 text-white">
          <SelectValue placeholder="Selecionar linha" />
        </SelectTrigger>
        <SelectContent className="bg-neutral-800 text-white">
          {existingLinhas.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
          <SelectItem key="__new" value="__new">
            Criar nova linha
          </SelectItem>
        </SelectContent>
      </Select>
      {isCreatingNewLinha && (
        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Nova linha"
          value={linha}
          onChange={(e) => setLinha(e.target.value)}
        />
      )}
      <input
        type="number"
        min={0}
        className="w-full p-2 rounded bg-neutral-800 text-white"
        placeholder="Dias para liberar o módulo"
        value={delayDays}
        onChange={(e) => setDelayDays(Number(e.target.value))}
      />

      {/* Inputs para adicionar/editar aulas */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Aulas</h3>
        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Título da aula"
          value={novaAula.titulo}
          onChange={(e) =>
            setNovaAula((v) => ({ ...v, titulo: e.target.value }))
          }
        />
        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="URL do vídeo"
          value={novaAula.videoUrl}
          onChange={(e) =>
            setNovaAula((v) => ({ ...v, videoUrl: e.target.value }))
          }
        />
        <div className="flex gap-2">
          <Button type="button" onClick={handleAddAula}>
            <Plus size={16} />
            {editingIndex !== null ? "Atualizar Aula" : "Adicionar Aula"}
          </Button>
        </div>
        <ul className="space-y-1">
          {aulas.map((a, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-neutral-800 p-2 rounded"
            >
              <span className="truncate">{a.titulo}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => editAula(idx)}>
                  <Edit className="text-blue-400" size={16} />
                </button>
                <button onClick={() => removeAula(idx)}>
                  <Trash2 className="text-red-400" size={16} />
                </button>
              </div>
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
}