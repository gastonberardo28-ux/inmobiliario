import Link from "next/link";
import type { Item } from "@/lib/data";
import { num, usd } from "@/lib/data";
import { Icon } from "./Icon";
import { Photo } from "./Photo";
import { Tag } from "./ui";

// Tarjeta con vista previa del aviso: la mejor foto arriba, el descuento como dato dominante
// y los hechos clave en una sola línea escaneable.
export function OpportunityCard({ item, index = 0 }: { item: Item; index?: number }) {
  return (
    <Link
      href={`/oportunidades/${item.id}/`}
      className="card spotlight lift group flex h-full flex-col"
      data-reveal
      style={{ ["--d" as string]: index % 3 }}
      aria-label={`${item.name}, ${item.zone}, ${usd(item.usd)}`}
    >
      <div className="photo relative aspect-[4/3]">
        <Photo src={item.photos?.[0]} alt={`${item.name}, ${item.zone}`} zone={item.zone} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.isNew && <Tag tone="primary"><Icon name="spark" size={13} />Nuevo</Tag>}
          {item.drop > 0 && <Tag tone="warn"><Icon name="down" size={13} />Bajó {usd(item.drop)}</Tag>}
          {item.hasCuotas && <Tag>Cuotas</Tag>}
        </div>
        {item.disc > 0 && (
          <div className={`absolute bottom-3 right-3 rounded-2xl px-3 py-2 text-right ${item.gem ? "bg-gem text-white" : "bg-surface text-ink"}`}>
            <p className="num text-2xl font-semibold leading-none">−{item.disc}%</p>
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider opacity-85">vs. barrio</p>
          </div>
        )}
        <p className="absolute bottom-3 left-3 flex items-center gap-1 text-sm font-semibold text-white drop-shadow">
          <Icon name="pin" size={15} />{item.zone}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="t-h3">{item.name}</h3>
        <p className="num mt-1 text-[1.35rem] font-semibold text-ink">{usd(item.usd)}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted">
          <li className="flex items-center gap-1.5"><Icon name="rooms" size={15} />{item.amb} amb.</li>
          <li className="flex items-center gap-1.5"><Icon name="area" size={15} />{num(item.total)} m²</li>
          <li className="flex items-center gap-1.5"><Icon name="calendar" size={15} />{item.del}</li>
        </ul>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4 mt-5 text-sm">
          <span className="num text-muted">USD {num(item.ppm)}/m² · barrio {num(item.median)}</span>
          <Icon name="arrow" size={18} className="text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
