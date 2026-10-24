"use client";
import { useMemo, useState } from "react";
import type { Item } from "@/lib/data";
import { OpportunityCard } from "./OpportunityCard";
import { Icon } from "./Icon";

type Sort = "disc" | "price" | "ppm" | "new";

// Filtros reales (zona, ambientes, solo gemas, cuotas) con conteo en vivo y estado vacío útil.
export function Filters({ items, zones }: { items: Item[]; zones: string[] }) {
  const [zone, setZone] = useState("todas");
  const [amb, setAmb] = useState(0);
  const [onlyGems, setOnlyGems] = useState(false);
  const [cuotas, setCuotas] = useState(false);
  const [sort, setSort] = useState<Sort>("disc");

  const list = useMemo(() => {
    const out = items.filter(
      (x) => (zone === "todas" || x.zone === zone) && (!amb || (amb === 3 ? x.amb >= 3 : x.amb === amb)) && (!onlyGems || x.gem) && (!cuotas || x.hasCuotas),
    );
    const by: Record<Sort, (a: Item, b: Item) => number> = {
      disc: (a, b) => b.disc - a.disc,
      price: (a, b) => a.usd - b.usd,
      ppm: (a, b) => a.ppm - b.ppm,
      new: (a, b) => b.first.localeCompare(a.first) || b.disc - a.disc,
    };
    return [...out].sort(by[sort]);
  }, [items, zone, amb, onlyGems, cuotas, sort]);

  const chip = "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors";
  const on = "border-ink bg-ink text-bg";
  const off = "border-line bg-surface text-text hover:border-line-strong";
  const reset = () => { setZone("todas"); setAmb(0); setOnlyGems(false); setCuotas(false); };

  return (
    <div>
      <div className="card mb-8 flex flex-col gap-4 p-4 sm:p-5" role="group" aria-label="Filtrar oportunidades">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-ink"><Icon name="pin" size={16} />Zona</span>
          {["todas", ...zones].map((z) => (
            <button key={z} type="button" aria-pressed={zone === z} onClick={() => setZone(z)} className={`${chip} ${zone === z ? on : off}`}>
              {z === "todas" ? "Todas" : z}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-ink"><Icon name="rooms" size={16} />Ambientes</span>
          {[0, 2, 3].map((n) => (
            <button key={n} type="button" aria-pressed={amb === n} onClick={() => setAmb(n)} className={`${chip} ${amb === n ? on : off}`}>
              {n === 0 ? "Todos" : n === 3 ? "3 o más" : "2"}
            </button>
          ))}
          <span className="mx-2 hidden h-6 w-px bg-line sm:block" />
          <button type="button" aria-pressed={onlyGems} onClick={() => setOnlyGems((v) => !v)} className={`${chip} ${onlyGems ? "border-gem bg-gem text-white" : off}`}>
            <span className="inline-flex items-center gap-1.5"><Icon name="gem" size={15} />Solo gemas</span>
          </button>
          <button type="button" aria-pressed={cuotas} onClick={() => setCuotas((v) => !v)} className={`${chip} ${cuotas ? on : off}`}>
            Con cuotas
          </button>
          <label className="ml-auto flex items-center gap-2 text-sm text-muted">
            Ordenar
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-line bg-field px-3 py-1.5 text-sm font-medium text-ink">
              <option value="disc">Mayor descuento</option>
              <option value="price">Menor precio</option>
              <option value="ppm">Menor USD/m²</option>
              <option value="new">Más nuevas</option>
            </select>
          </label>
        </div>
      </div>

      <p className="num mb-5 text-sm text-muted" aria-live="polite">
        {list.length} {list.length === 1 ? "oportunidad" : "oportunidades"}
      </p>

      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((x, i) => <OpportunityCard key={x.id} item={x} index={i} />)}
        </div>
      ) : (
        <div className="card grid place-items-center gap-3 p-12 text-center">
          <Icon name="filter" size={28} className="text-muted" />
          <p className="t-h3">No hay oportunidades con esos filtros</p>
          <button type="button" onClick={reset} className="btn btn-secondary">Limpiar filtros</button>
        </div>
      )}
    </div>
  );
}
