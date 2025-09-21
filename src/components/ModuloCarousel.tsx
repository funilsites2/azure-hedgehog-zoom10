import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";

type Aula = { id: number; titulo: string; videoUrl: string };
type Modulo = { id: number; nome: string; capa: string; aulas: Aula[] };

interface ModuloCarouselProps {
  modulos: Modulo[];
  onModuloClick?: (modulo: Modulo) => void;
  alunoLayout?: boolean;
}

export const ModuloCarousel: React.FC<ModuloCarouselProps> = ({
  modulos,
  onModuloClick,
  alunoLayout = false,
}) => {
  // Para mobile: 1.5 cards visíveis se alunoLayout, senão 2
  const slidesToShow = alunoLayout ? 1.5 : 2;

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
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Tamanhos dos cards
  const mobileCardWidth = alunoLayout
    ? "w-[70vw] max-w-[320px] min-w-[220px]"
    : "min-w-1/2 max-w-[90vw]";

  const mobilePeek = alunoLayout
    ? { flex: "0 0 66%", marginRight: "2vw" }
    : { flex: "0 0 50%" };

  // Desktop grid columns
  const desktopGridCols = alunoLayout
    ? "md:grid-cols-3 lg:grid-cols-5"
    : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <div>
      {/* Mobile: carrossel */}
      <div className="block md:hidden">
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {modulos.map((modulo, idx) => (
                <div
                  className={`${mobileCardWidth} flex-shrink-0 px-2`}
                  style={mobilePeek}
                  key={modulo.id}
                >
                  <div
                    className={`bg-neutral-800 rounded-lg p-4 shadow-lg flex flex-col h-full cursor-pointer`}
                    onClick={onModuloClick ? () => onModuloClick(modulo) : undefined}
                  >
                    <div className="mb-2 flex flex-col items-center">
                      <img
                        src={modulo.capa}
                        alt={modulo.nome}
                        className="w-full aspect-[3/4] object-cover rounded mb-2"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/300x400?text=Sem+Capa")
                        }
                      />
                      <h2 className="text-base font-semibold text-center">{modulo.nome}</h2>
                    </div>
                    <ul>
                      {modulo.aulas.map((aula) => (
                        <li key={aula.id} className="flex items-center gap-2 mb-1 text-xs">
                          <Video size={16} /> {aula.titulo}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Navegação */}
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
      {/* Desktop: grid */}
      <div className={`hidden md:grid grid-cols-1 ${desktopGridCols} gap-4`}>
        {modulos.map((modulo) => (
          <div
            key={modulo.id}
            className={`bg-neutral-800 rounded-lg p-3 shadow-lg flex flex-col h-full cursor-pointer`}
            onClick={onModuloClick ? () => onModuloClick(modulo) : undefined}
          >
            <div className="mb-2 flex flex-col items-center">
              <img
                src={modulo.capa}
                alt={modulo.nome}
                className="w-full aspect-[3/4] object-cover rounded mb-2"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/300x400?text=Sem+Capa")
                }
              />
              <h2 className="text-base font-semibold text-center">{modulo.nome}</h2>
            </div>
            <ul>
              {modulo.aulas.map((aula) => (
                <li key={aula.id} className="flex items-center gap-2 mb-1 text-xs">
                  <Video size={16} /> {aula.titulo}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};