"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit as EditIcon, Trash2 } from "lucide-react";
import type { AulaInput } from "@/components/ModuleForm";

interface LessonsEditorProps {
  initialAulas: AulaInput[];
  onChange: (aulas: AulaInput[]) => void;
}

const LessonsEditor: React.FC<LessonsEditorProps> = ({ initialAulas, onChange }) => {
  const [aulas, setAulas] = useState<AulaInput[]>(initialAulas ?? []);
  const [form, setForm] = useState<AulaInput>({ titulo: "", videoUrl: "", descricao: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setAulas(initialAulas ?? []);
  }, [initialAulas]);

  const pushChange = (next: AulaInput[]) => {
    setAulas(next);
    onChange(next);
  };

  const handleAddOrSave = () => {
    if (!form.titulo.trim() || !form.videoUrl.trim()) return;
    if (editingIndex !== null) {
      const next = aulas.map((a, i) => (i === editingIndex ? { ...a, ...form } : a));
      pushChange(next);
      setEditingIndex(null);
    } else {
      const next = [...aulas, form];
      pushChange(next);
    }
    setForm({ titulo: "", videoUrl: "", descricao: "" });
  };

  const handleEdit = (idx: number) => {
    setForm(aulas[idx]);
    setEditingIndex(idx);
  };

  const handleRemove = (idx: number) => {
    const next = aulas.filter((_, i) => i !== idx);
    pushChange(next);
    if (editingIndex === idx) {
      setEditingIndex(null);
      setForm({ titulo: "", videoUrl: "", descricao: "" });
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setForm({ titulo: "", videoUrl: "", descricao: "" });
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Aulas</h3>

      <div className="space-y-2 mb-4">
        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Título da aula"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="URL do vídeo"
          value={form.videoUrl}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Descrição (opcional)"
          value={form.descricao ?? ""}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleAddOrSave}
            className="rounded-full border border-emerald-500/30 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-500/50 shadow-sm"
          >
            {editingIndex !== null ? "Salvar" : "Adicionar"}
          </Button>
          {editingIndex !== null && (
            <Button variant="secondary" onClick={cancelEdit}>
              Cancelar
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {aulas.map((a, i) => (
          <div key={i} className="flex items-center justify-between bg-neutral-800 rounded p-3">
            <div className="min-w-0">
              <div className="font-medium truncate">{a.titulo}</div>
              <div className="text-xs text-neutral-400 truncate">{a.videoUrl}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" variant="secondary" onClick={() => handleEdit(i)} title="Editar">
                <EditIcon size={16} />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleRemove(i)} title="Remover">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
        {aulas.length === 0 && (
          <div className="text-sm text-neutral-400">Nenhuma aula adicionada.</div>
        )}
      </div>
    </div>
  );
};

export default LessonsEditor;