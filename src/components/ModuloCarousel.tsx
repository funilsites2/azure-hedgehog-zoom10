import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import SimpleProgress from "@/components/SimpleProgress";

type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
  bloqueado?: boolean;
  assistida?: boolean;
};
type Modulo = {
  id: number;
  nome: string;
  capa: string;
  aulas: Aula[];
  bloqueado?: boolean;
  releaseDate?: number;
};

interface ModuloCarouselProps {
  modulos: Modulo[];
  onModuloClick?: (modulo: Modulo) => void;
  alunoLayout?: boolean;
  showLocked?: boolean;
}

export const ModuloCarousel: React.FC<ModuloCarouselProps> = ({
  modulos,
  onModuloClick,
  alunoLayout = false,
  showLocked,
}) => {
  const now = Date.now();

  const filteredModulos =
    showLocked === true
      ? modulos.filter((m) => m.bloqueado)
      : showLocked === false
      ? modulos.filter((m) => !m.bloqueado)
      : modulos;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    align: "start",
    dragFree: false,
    breakpoints: {
      "(min-width: 768px)": { active: false },
    },
  });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const mobileCardWidth = alunoLayout
    ? "w-[60vw] max-w-[280px] min-w-[180px]"
    : "min-w-1/2 max-w-[90vw]";

  return (
    <div>
      {/* Mobile carousel */}
      <div className="block md:hidden">
        <div className="relative">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex">
              {filteredModulos.map((modulo) => {
                const total = modulo.aulas.length;
                const concluido = modulo.aulas.filter((a) => a.assistida).length;
                const progresso = total ? Math.round((concluido / total) * 100) : 0;
                return (
                  <div
                    key={modulo.id}
                    className={`${mobileCardWidth} flex-shrink-0 px-2`}
                    style={alunoLayout ? { flex: "0 0 60%", marginRight: "2vw" } : undefined}
                  >
                    <div
                      className={`group bg-neutral-800 rounded-xl overflow-hidden p-4 shadow-lg flex flex-col h-full cursor-pointer relative hover:z-10 ${
                        modulo.bloqueado ? "grayscale opacity-70" : ""
                      }`}
                      onClick={
                        !modulo.bloqueado && onModuloClick
                          ? () => onModuloClick(modulo)
                          : undefined
                      }
                    >
                      {modulo.releaseDate && now < modulo.releaseDate && (
                        <div className="absolute top-0 inset-x-0 bg-yellow-500 text-black text-xs text-center py-1 rounded-t-xl">
                          Liberado em {new Date(modulo.releaseDate).toLocaleDateString()}
                        </div>
                      )}
                      {modulo.bloqueado && (
                        <Lock
                          size={28}
                          className="absolute top-2 right-2 text-red-500 bg-neutral-900 rounded-full p-1"
                        />
                      )}
                      <div className="mb-2 flex flex-col items-center">
                        <img
                          src={modulo.capa}
                          alt={modulo.nome}
                          className="w-full aspect-[3/4] object-cover rounded-xl mb-2 transition-transform duration-300 ease-out group-hover:scale-105"
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://placehold.co/300x400?text=Sem+Capa")
                          }
                        />
                        <h2 className="text-base font-semibold text-center text-white">
                          {modulo.nome}
                        </h2>
                        <div className="w-full mt-2">
                          <SimpleProgress value={progresso} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-neutral-900/80 rounded-full p-2 z-10"
            onClick={() => emblaApi && emblaApi.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Anterior"
            style={{ opacity: canScrollPrev ? 1 : 0.3 }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-neutral-900/80 rounded-full p-2 z-10"
            onClick={() => emblaApi && emblaApi.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Próximo"
            style={{ opacity: canScrollNext ? 1 : 0.3 }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Desktop carousel sem scrollbar */}
      <div className="hidden md:flex overflow-x-auto gap-4 snap-x snap-mandatory px-2 no-scrollbar">
        {filteredModulos.map((modulo) => {
          const total = modulo.aulas.length;
          const concluido = modulo.aulas.filter((a) => a.assistida).length;
          const progresso = total ? Math.round((concluido / total) * 100) : 0;
          return (
            <div
              key={modulo.id}
              className={`group relative snap-start flex-shrink-0 w-[20%] rounded-xl shadow-lg overflow-hidden cursor-pointer hover:z-10 ${
                modulo.bloqueado ? "grayscale opacity-70" : ""
              }`}
              onClick={
                !modulo.bloqueado && onModuloClick
                  ? () => onModuloClick(modulo)
                  : undefined
              }
            >
              {modulo.releaseDate && now < modulo.releaseDate && (
                <div className="absolute top-0 inset-x-0 bg-yellow-500 text-black text-xs text-center py-1 rounded-t-xl">
                  Liberado em {new Date(modulo.releaseDate).toLocaleDateString()}
                </div>
              )}
              {modulo.bloqueado && (
                <Lock
                  size={28}
                  className="absolute top-2 right-2 text-red-500 bg-neutral-900 rounded-full p-1"
                />
              )}
              <img
                src={modulo.capa}
                alt={modulo.nome}
                className="w-full aspect-[3/4] object-cover rounded-xl transition-transform duration-300 ease-out group-hover:scale-105"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/300x400?text=Sem+Capa")
                }
              />
              <div className="p-3 flex flex-col items-center">
                <h2 className="text-base font-semibold text-center text-white">
                  {modulo.nome}
                </h2>
                <div className="w-full mt-2">
                  <SimpleProgress value={progresso} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};