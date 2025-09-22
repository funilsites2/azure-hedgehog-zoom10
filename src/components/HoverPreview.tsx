import React from "react";

interface HoverPreviewProps {
  videoUrl?: string;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  // match youtube id from multiple url formats
  const patterns = [
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

const HoverPreview: React.FC<HoverPreviewProps> = ({ videoUrl, imageSrc, alt = "", className = "" }) => {
  const [hover, setHover] = React.useState(false);
  const [iframeSrc, setIframeSrc] = React.useState<string | null>(null);
  const ytId = getYouTubeId(videoUrl);

  React.useEffect(() => {
    if (hover && ytId) {
      // build embed URL with autoplay muted and loop
      setIframeSrc(
        `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${ytId}`
      );
    } else {
      // remove src to stop playback
      setIframeSrc(null);
    }
  }, [hover, ytId]);

  const thumb =
    imageSrc ||
    (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "https://placehold.co/300x400?text=Sem+Capa");

  return (
    <div
      className={`relative overflow-hidden rounded ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img src={thumb} alt={alt} className="w-full h-full object-cover block" />
      {ytId && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            iframeSrc ? "opacity-100" : "opacity-0"
          }`}
        >
          {iframeSrc ? (
            <iframe
              title={`preview-${ytId}`}
              src={iframeSrc}
              className="w-full h-full"
              frameBorder={0}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default HoverPreview;