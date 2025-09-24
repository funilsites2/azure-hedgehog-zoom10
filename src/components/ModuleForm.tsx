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
  initialExternalUrl?: string;
  onSubmit: (
    nome: string,
    capa: string,
    aulas: AulaInput[],
    linha: string,
    delayDays: number,
    externalUrl?: string
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
  initialExternalUrl = "",
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
  const [delayDays, setDelayDays] = useState<number>(initialDelayDays);
  const [externalUrl, setExternalUrl] = useState<string>(initialExternalUrl);

  const [isCreatingNewLinha, setIsCreatingNewLinha] = useState(false);
  const [isEditingLinha, setIsEditingLinha] = useState(false);

  const notifyAulasChange = (nextAulas: AulaInput[]) => {
    try {
      onAulasChange?.(nextAulas);
    } catch {
      //
    }
  };

  const handleSubmit = () => {
    if (!nome.trim() || !capa.trim() || !linha.trim()) return;
    onSubmit(nome, capa, aulas, linha, delayDays, externalUrl?.trim() || undefined);
    setNome("");
    setCapa("");
    setLinha("");
    setAulas([]);
    setDelayDays(0);
    setExternalUrl("");
    setIsCreatingNewLinha(false);
    setIsEditingLinha(false);
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
        placeholder="URL externa de compra (opcional)"
        value={externalUrl}
        onChange={(e) => setExternalUrl(e.target.value)}
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

      <div className="space-y-1">
        <span className="text-sm text-neutral-300">
          Dias ( apos a matricula ) para liberar esse modulo
        </span>
        <input
          type="number"
          min={0}
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Dias para liberar o módulo"
          value={delayDays}
          onChange={(e) => setDelayDays(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleSubmit}
          className="rounded-full border border-emerald-500/30 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-500/50 shadow-sm"
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
};