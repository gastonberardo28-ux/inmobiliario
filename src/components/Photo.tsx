"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

// Foto del aviso enlazada a la fuente original (sin referrer). Si no carga o están apagadas,
// muestra un placeholder con la zona en vez de un hueco roto.
export function Photo({ src, alt, zone, className = "", eager = false }: { src?: string; alt: string; zone: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Si la imagen falló antes de que React se hidratara, onError ya no dispara: lo detectamos al montar.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!site.showPhotos || !src || failed) {
    return (
      <div className={`grid h-full w-full place-items-center bg-panel text-muted ${className}`} role="img" aria-label={alt}>
        <div className="flex flex-col items-center gap-2">
          <Icon name="building" size={32} />
          <span className="num text-xs uppercase tracking-widest">{zone}</span>
        </div>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
