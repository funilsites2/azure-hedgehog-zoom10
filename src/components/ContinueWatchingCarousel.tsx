"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Aula = {
  id: number;
  titulo: string;
  videoUrl: string;
};

type Modulo = {
  id: number;
  nome: string;
};

interface ContinueWatchingCarouselProps {
  items: { modulo: Modulo; aula: Aula }[];
  onSelect: (moduloId: number, aulaId: number) => void;
}

export const ContinueWatchingCarousel: React.FC<ContinueWatchingCarouselProps> = ({
  items,
  onSelect,
}) => {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    loop: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelectEmbla = () => {
      setCanPrev(embla.canScrollPrev());
      setCanNext(embla.canScrollNext());
    };
    embla.on("select", onSelectEmbla);
    onSelectEmbla();
    return () => {
      embla.off("select", onSelectEmbla);
    };
  }, [embla]);

  function getYoutubeThumbnail(url: string) {
    const match = url.match(
      /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : "/placeholder.svg";
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map(({ modulo, aula }) => (
            <div
              key={aula.id}
              className="flex-shrink-0 w-1/2 md:w-1/5 cursor-pointer"
              onClick={() => onSelect(modulo.id, aula.id)}
            >
              <img
                src={getYoutubeThumbnail(aula.videoUrl)}
                alt={aula.titulo}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p className="text-white font-medium truncate">{aula.titulo}</p>
              <p className="text-neutral-400 text-sm truncate">{modulo.nome}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-neutral-900 rounded-full p-2 z-10"
        onClick={() => embla && embla.scrollPrev()}
        disabled={!canPrev}
        aria-label="Anterior"
        style={{ opacity: canPrev ? 1 : 0.3 }}
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-neutral-900 rounded-full p-2 z-10"
        onClick={() => embla && embla.scrollNext()}
        disabled={!canNext}
        aria-label="Próximo"
        style={{ opacity: canNext ? 1 : 0.3 }}
      >
        <ChevronRight size={20} className="text-white" />
      </button>
    </div>
  );
};

export default ContinueWatchingCarousel;