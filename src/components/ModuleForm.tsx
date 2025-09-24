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
  descricao?: string;
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
  onAulasChange?: (aulas: AulaInput[]) => void;
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
  const [novaAula, setNovaAula] = useState<AulaInput>({
    titulo: "",
    videoUrl: "",
    descricao: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreatingNewLinha, setIsCreatingNewLinha] = useState(false);
  const [isEditingLinha, setIsEditingLinha] = useState(false);
  const [delayDays, setDelayDays] = useState<number>(initialDelayDays);

  const isAddModuleAction = submitLabel.toLowerCase().includes("adicionar");
  const isUpdateModuleAction = submitLabel.toLowerCase().includes("atualizar");
  const isPrimarySubmit = isAddModuleAction || isUpdateModuleAction;
  const isAddingLesson = editingIndex === null;

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
      setAulas((prev) => {
        const next = prev.map((a, i) =>
          i === editingIndex ? { ...a, ...novaAula } : a
        );
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
    setNovaAula({ titulo: "", videoUrl: "", descricao: "" });
  };

  const removeAula = (idx: number) => {
    setAulas((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      notifyAulasChange(next);
      return next;
    });
    if (editingIndex === idx) {
      setEditingIndex(null);
      setNovaAula({ titulo: "", videoUrl: "", descricao: "" });
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
    setIsEditingLinha(false);
    setEditingIndex(null);
    setNovaAula({ titulo: "", videoUrl: "", descricao: "" });
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
            setIsEditingLinha(false);
            setLinha("");
          } else if (value === "__edit") {
            setIsCreatingNewLinha(false);
            setIsEditingLinha(true);
          } else {
            setIsCreatingNewLinha(false);
            setIsEditingLinha(false);
            setLinha(value);
          }
        }}
        value={isCreatingNewLinha ? "__new" : isEditingLinha ? "__edit" : linha}
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
          <SelectItem key="__edit" value="__edit">
            Editar nome da linha
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

      {isEditingLinha && !isCreatingNewLinha && (
        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Editar nome da linha"
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

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleSubmit}
          className={
            isPrimarySubmit
              ? "rounded-full border border-emerald-500/30 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-500/50 shadow-sm"
              : undefined
          }
        >
          {submitLabel}
        </Button>
      </div>

      {onCancel && (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};