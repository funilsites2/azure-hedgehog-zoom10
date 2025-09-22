import { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
  assistida?: boolean;
};

type Modulo = {
  id: number;
  nome: string;
  aulas: Aula[];
};

interface AulaPlayerProps {
  modulo: Modulo;
  aulaSelecionadaId: number;
  onSelecionarAula: (aulaId: number) => void;
  onMarcarAssistida: (aulaId: number) => void;
}

// Função para extrair thumbnail do YouTube
function getYoutubeThumbnail(url: string): string | null {
  try {
    const match = url.match(
      /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return null;
  } catch {
    return null;
  }
}

export function AulaPlayer({
  modulo,
  aulaSelecionadaId,
  onSelecionarAula,
  onMarcarAssistida,
}: AulaPlayerProps) {
  const aulas = modulo.aulas;

  // Guard for modules without aulas
  if (!aulas || aulas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-neutral-300">Nenhuma aula disponível neste módulo.</span>
      </div>
    );
  }

  const aulaIndex = aulas.findIndex((a) => a.id === aulaSelecionadaId);
  const aula = aulas[aulaIndex] ?? aulas[0];
  const hasPrev = aulaIndex > 0;
  const hasNext = aulaIndex < aulas.length - 1;

  // Module progress calculation
  const totalAulasModulo = aulas.length;
  const assistidasModulo = aulas.filter((a) => a.assistida).length;
  const progressoModulo = totalAulasModulo
    ? Math.round((assistidasModulo / totalAulasModulo) * 100)
    : 0;

  const [tab, setTab] = useState("video");

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      {/* Player + Controls */}
      <div className="w-full md:w-2/3 flex flex-col">
        {/* Top: Concluir Aula */}
        <div className="flex justify-end items-center mb-2">
          {!aula.assistida ? (
            <button
              className="text-xs bg-green-600 px-3 py-1 rounded hover:bg-green-700"
              onClick={() => onMarcarAssistida(aula.id)}
            >
              Concluir Aula
            </button>
          ) : (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle size={16} /> Concluída
            </span>
          )}
        </div>
        {/* Module Progress */}
        <div className="mb-4 px-2">
          <Progress value={progressoModulo} className="h-2 bg-neutral-800" />
          <div className="text-xs text-neutral-400 mt-1">
            {progressoModulo}% do módulo concluído
          </div>
        </div>
        {/* Video */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg w-full">
          <iframe
            src={aula.videoUrl}
            title={aula.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="bg-neutral-800 mb-2">
            <TabsTrigger value="video">Vídeo</TabsTrigger>
            <TabsTrigger value="texto">Aula em texto</TabsTrigger>
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="apresentacao">Apresentação</TabsTrigger>
            <TabsTrigger value="mapa">Mapa Mental</TabsTrigger>
          </TabsList>
          <TabsContent value="video">
            <div className="text-neutral-300 text-sm">
              Assista ao vídeo acima para acompanhar a aula.
            </div>
          </TabsContent>
          <TabsContent value="texto">
            <div className="text-neutral-300 text-sm">
              <b>Conteúdo em texto:</b> <br />
              Aqui você pode colocar a transcrição ou texto da aula.
            </div>
          </TabsContent>
          <TabsContent value="resumo">
            <div className="text-neutral-300 text-sm">
              <b>Resumo:</b> <br />
              Pontos principais da aula.
            </div>
          </TabsContent>
          <TabsContent value="apresentacao">
            <div className="text-neutral-300 text-sm">
              <b>Apresentação:</b> <br />
              Slides ou materiais de apoio.
            </div>
          </TabsContent>
          <TabsContent value="mapa">
            <div className="text-neutral-300 text-sm">
              <b>Mapa Mental:</b> <br />
              Imagem ou link para mapa mental.
            </div>
          </TabsContent>
        </Tabs>
        {/* Title */}
        <div className="mt-4">
          <span className="font-semibold text-lg">
            {modulo.nome} - {aula.titulo}
          </span>
        </div>
        {/* Bottom: Navegação de Aulas */}
        <div className="flex justify-between mt-4">
          {hasPrev ? (
            <button
              className="flex items-center gap-1 text-sm bg-neutral-800 px-3 py-1 rounded hover:bg-neutral-700"
              onClick={() => onSelecionarAula(aulas[aulaIndex - 1].id)}
            >
              <ChevronLeft size={16} /> Voltar
            </button>
          ) : <div />}
          {hasNext ? (
            <button
              className="flex items-center gap-1 text-sm bg-neutral-800 px-3 py-1 rounded hover:bg-neutral-700"
              onClick={() => onSelecionarAula(aulas[aulaIndex + 1].id)}
            >
              Próxima <ChevronRight size={16} />
            </button>
          ) : <div />}
        </div>
      </div>
      {/* Lista lateral de aulas */}
      <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col">
        <div className="bg-neutral-800 rounded-lg p-3 shadow-lg h-full flex flex-col">
          <div className="font-semibold mb-2 text-neutral-200 text-center">
            Aulas do módulo
          </div>
          <ul className="flex flex-col gap-2 overflow-y-auto">
            {modulo.aulas.map((a) => {
              const thumb =
                getYoutubeThumbnail(a.videoUrl) ||
                "https://placehold.co/80x45/222/fff?text=Video";
              return (
                <li
                  key={a.id}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 rounded cursor-pointer transition group",
                    a.id === aulaSelecionadaId
                      ? "bg-green-700/80 text-white"
                      : "hover:bg-neutral-700 text-neutral-300"
                  )}
                  onClick={() => onSelecionarAula(a.id)}
                >
                  <img
                    src={thumb}
                    alt="thumb"
                    className="w-20 h-12 object-cover rounded border border-neutral-700"
                  />
                  <span className="flex-1 truncate text-sm">{a.titulo}</span>
                  {a.assistida && <CheckCircle size={16} className="text-green-400" />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
);
}