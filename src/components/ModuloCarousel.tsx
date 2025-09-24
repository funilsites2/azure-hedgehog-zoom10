import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Lock, Clock, X } from "lucide-react";
import SimpleProgress from "@/components/SimpleProgress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

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
  externalUrl?: string;
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

  const [blockedModulo, setBlockedModulo] = React.useState<Modulo | null>(null);
  const [purchaseModulo, setPurchaseModulo] = React.useState<Modulo | null>(null);

  const mobileCardWidth = alunoLayout
    ? "w-[60vw] max-w-[280px] min-w-[180px]"
    : "min-w-1/2 max-w-[90vw]";

  const handlePurchaseClick = () => {
    if (purchaseModulo?.externalUrl) {
      window.open(purchaseModulo.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      showSuccess("Redirecionando para compra...");
    }
  };

  return (
    <div>
      {/* Mobile carousel */}
      <div className="block md:hidden">
        <div className="relative">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex pb-20 md:pb-0">
              {filteredModulos.map((modulo) => {
                const total = modulo.aulas.length;
                const concluido = modulo.aulas.filter((a) => a.assistida).length;
                const progresso = total ? Math.round((concluido / total) * 100) : 0;
                const blockedByDate = !!(modulo.releaseDate && now < modulo.releaseDate);
                const shouldGray = modulo.bloqueado || blockedByDate;
                return (
                  <div
                    key={modulo.id}
                    className={`${mobileCardWidth} flex-shrink-0 px-2`}
                    style={alunoLayout ? { flex: "0 0 60%", marginRight: "2vw" } : undefined}
                  >
                    <div
                      className={`group bg-neutral-800 rounded-xl overflow-hidden p-4 shadow-lg flex flex-col h-full relative hover:z-10 ${
                        blockedByDate ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (blockedByDate) {
                          setBlockedModulo(modulo);
                          return;
                        }
                        if (modulo.bloqueado) {
                          setPurchaseModulo(modulo);
                          return;
                        }
                        if (onModuloClick) {
                          onModuloClick(modulo);
                        }
                      }}
                    >
                      {blockedByDate && (
                        <>
                          <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-orange-600 to-orange-400 text-white text-xs text-center py-1 rounded-t-xl">
                            Bloqueado até {new Date(modulo.releaseDate!).toLocaleDateString()}
                          </div>
                          <div
                            className="absolute top-2 right-2 left-auto z-20 transition-all duration-300 ease-out transform group-hover:top-1/2 group-hover:right-auto group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2"
                            aria-hidden
                          >
                            <Clock size={28} className="text-yellow-400 bg-neutral-900 rounded-full p-1" />
                          </div>
                        </>
                      )}
                      {modulo.bloqueado && !blockedByDate && (
                        <div
                          className="absolute top-2 right-2 left-auto z-20 transition-all duration-300 ease-out transform group-hover:top-1/2 group-hover:right-auto group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2"
                          aria-hidden
                        >
                          <Lock
                            size={28}
                            className="text-red-500 bg-neutral-900 rounded-full p-1"
                          />
                        </div>
                      )}
                      <div className={`mb-2 flex flex-col items-center ${shouldGray ? "grayscale" : ""}`}>
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
          const blockedByDate = !!(modulo.releaseDate && now < modulo.releaseDate);
          const shouldGray = modulo.bloqueado || blockedByDate;
          return (
            <div
              key={modulo.id}
              className={`group relative snap-start flex-shrink-0 w-[18%] rounded-xl shadow-lg overflow-hidden hover:z-10 ${
                blockedByDate ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => {
                if (blockedByDate) {
                  setBlockedModulo(modulo);
                  return;
                }
                if (modulo.bloqueado) {
                  setPurchaseModulo(modulo);
                  return;
                }
                if (onModuloClick) {
                  onModuloClick(modulo);
                }
              }}
            >
              {blockedByDate && (
                <>
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-orange-600 to-orange-400 text-white text-xs text-center py-1 z-20 rounded-t-xl">
                    Bloqueado até {new Date(modulo.releaseDate!).toLocaleDateString()}
                  </div>
                  <div
                    className="absolute top-2 right-2 left-auto z-20 transition-all duration-300 ease-out transform group-hover:top-1/2 group-hover:right-auto group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2"
                    aria-hidden
                  >
                    <Clock size={28} className="text-yellow-400 bg-neutral-900 rounded-full p-1" />
                  </div>
                </>
              )}
              {modulo.bloqueado && !blockedByDate && (
                <div
                  className="absolute top-2 right-2 left-auto z-20 transition-all duration-300 ease-out transform group-hover:top-1/2 group-hover:right-auto group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2"
                  aria-hidden
                >
                  <Lock
                    size={28}
                    className="text-red-500 bg-neutral-900 rounded-full p-1"
                  />
                </div>
              )}
              <img
                src={modulo.capa}
                alt={modulo.nome}
                className={`w-full aspect-[3/4] object-cover rounded-xl transition-transform duration-300 ease-out group-hover:scale-105 ${shouldGray ? "grayscale" : ""}`}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/300x400?text=Sem+Capa")
                }
              />
              <div className={`p-3 flex flex-col items-center ${shouldGray ? "grayscale" : ""}`}>
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

      {/* Modal informando bloqueio por dias */}
      <Dialog
        open={!!blockedModulo}
        onOpenChange={(open) => {
          if (!open) setBlockedModulo(null);
        }}
      >
        <DialogContent className="sm:max-w-md w-[92vw] md:w-auto bg-transparent p-0 border-0 shadow-none">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_15px_60px_rgba(0,0,0,0.6)]">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-2 right-2 h-9 w-9 p-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white z-20"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-neutral-900/80 to-neutral-800/70 backdrop-blur-2xl">
              <div className="p-6 md:p-8 text-center">
                <DialogHeader className="text-center space-y-1">
                  <DialogTitle className="text-white text-xl md:text-2xl font-semibold text-center">
                    Módulo bloqueado temporariamente
                  </DialogTitle>
                  <DialogDescription className="text-neutral-300 text-center">
                    {blockedModulo?.releaseDate
                      ? `Este módulo será liberado em ${new Date(
                          blockedModulo.releaseDate
                        ).toLocaleString()}.`
                      : "Este módulo está temporariamente indisponível."}
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-neutral-400 text-center mt-3">
                  Assim que a data for atingida, o conteúdo ficará disponível automaticamente para você.
                </div>
                <div className="mt-6 flex justify-center">
                  <DialogClose asChild>
                    <Button className="rounded-full border border-orange-400/50 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-500/60 transition-colors px-6">
                      Fechar
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de compra quando bloqueado por acesso (cadeado) */}
      <Dialog
        open={!!purchaseModulo}
        onOpenChange={(open) => {
          if (!open) setPurchaseModulo(null);
        }}
      >
        <DialogContent className="sm:max-w-md w-[92vw] md:w-auto bg-transparent p-0 border-0 shadow-none">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_15px_60px_rgba(0,0,0,0.6)]">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-2 right-2 h-9 w-9 p-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white z-20"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-neutral-900/80 to-neutral-800/70 backdrop-blur-2xl">
              <div className="p-6 md:p-8 text-center">
                <DialogHeader className="text-center space-y-1">
                  <DialogTitle className="text-white text-xl md:text-2xl font-semibold text-center">
                    Curso não adquirido
                  </DialogTitle>
                  <DialogDescription className="text-neutral-300 text-center">
                    Este curso pode ser adquirido à parte
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-neutral-400 text-center mt-3">
                  Deseja comprar esse curso? clique no botão abaixo.
                </div>
                <div className="mt-6 flex justify-center">
                  <DialogClose asChild>
                    <Button
                      className="rounded-full border border-orange-400/50 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-500/60 transition-colors px-6"
                      onClick={handlePurchaseClick}
                    >
                      Comprar curso
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};