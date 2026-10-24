"use client";
import { useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { Photo } from "./Photo";

// Galería con miniaturas y crédito a la fuente original.
export function Gallery({ photos, alt, zone, credit, href }: { photos: string[]; alt: string; zone: string; credit?: string; href: string }) {
  const [i, setI] = useState(0);
  const n = photos.length;
  if (!site.showPhotos || !n) return <Photo alt={alt} zone={zone} className="aspect-[16/10] rounded-[var(--radius-card)]" />;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <div>
      <div className="photo relative aspect-[16/10] rounded-[var(--radius-card)]">
        <Photo key={photos[i]} src={photos[i]} alt={`${alt}, foto ${i + 1} de ${n}`} zone={zone} eager />
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Foto anterior" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow">
              <Icon name="chevronL" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Foto siguiente" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow">
              <Icon name="chevronR" />
            </button>
          </>
        )}
        <p className="num absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
          {i + 1}/{n}
        </p>
        {credit && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white hover:bg-black/80">
            Foto: {credit}
          </a>
        )}
      </div>
      {n > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {photos.map((p, k) => (
            <button key={p} type="button" onClick={() => setI(k)} aria-label={`Ver foto ${k + 1}`} aria-current={k === i} className={`photo aspect-[4/3] overflow-hidden rounded-xl border-2 transition ${k === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <Photo src={p} alt="" zone={zone} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
