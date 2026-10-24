import Link from "next/link";
import { site } from "@/lib/site";
import { longDate, updated } from "@/lib/data";
import { Icon } from "./Icon";
import { container } from "./ui";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className={`${container} grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]`}>
        <div>
          <p className="flex items-center gap-2.5 text-lg font-extrabold text-ink">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-ink"><Icon name="gem" size={18} /></span>
            {site.name}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{site.description}</p>
          <p className="num mt-6 text-xs text-muted">Última actualización: {longDate(updated)}</p>
        </div>
        <div>
          <p className="t-eyebrow mb-4">Sitio</p>
          <ul className="space-y-2.5 text-sm">
            {site.nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="link !font-medium !text-text">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="t-eyebrow mb-4">Fuentes</p>
          <ul className="space-y-2.5 text-sm text-text">
            {site.sources.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className={`${container} py-6 text-xs leading-relaxed text-muted`}>
          Información de avisos públicos con fines informativos. No es asesoramiento financiero ni oferta de venta. Las fotos pertenecen a los avisos originales y se muestran con enlace a la fuente.
        </p>
      </div>
    </footer>
  );
}
