import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem, items, longDate, nextItem, num, related, usd, GEM_THRESHOLD } from "@/lib/data";
import { checklist, site } from "@/lib/site";
import { Gallery } from "@/components/Gallery";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Icon, IconTile, type IconName } from "@/components/Icon";
import { Button, container, SectionHeader, Tag } from "@/components/ui";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return items.map((x) => ({ id: x.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const x = getItem(id);
  if (!x) return {};
  const title = `${x.name}, ${x.zone}: ${usd(x.usd)}`;
  const description = `${x.amb} ambientes, ${num(x.total)} m², ${x.stage.toLowerCase()}. ${x.disc > 0 ? `${x.disc}% por debajo del USD/m² medio de ${x.zone}.` : ""} ${x.fin}.`;
  return {
    title,
    description,
    alternates: { canonical: `/oportunidades/${x.id}/` },
    openGraph: { title, description, images: site.showPhotos && x.photos?.[0] ? [{ url: x.photos[0] }] : undefined },
  };
}

export default async function Detail({ params }: Props) {
  const { id } = await params;
  const x = getItem(id);
  if (!x) notFound();
  const next = nextItem(x);
  const source = x.links[0];
  const max = Math.max(x.ppm, x.median);

  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: "rooms", label: "Ambientes", value: String(x.amb) },
    { icon: "area", label: "Superficie", value: x.ext ? `${num(x.cub)} m² cub. + ${num(x.ext)} m² desc.` : `${num(x.cub)} m² cubiertos` },
    { icon: "crane", label: "Etapa", value: x.stage },
    { icon: "calendar", label: "Entrega", value: x.del },
    { icon: "card", label: "Financiación", value: x.fin },
    { icon: "building", label: "Quién construye", value: x.dev },
  ];

  return (
    <>
      <div className={`${container} pt-8`}>
        <nav aria-label="Ruta" className="text-sm text-muted">
          <Link href="/" className="link !font-medium !text-muted">Oportunidades</Link>
          <span className="mx-2">/</span>
          <span>{x.zone}</span>
        </nav>
      </div>

      <section className={`${container} grid gap-10 pt-6 lg:grid-cols-[1.35fr_1fr]`}>
        <div data-reveal="scale">
          <Gallery photos={x.photos ?? []} alt={`${x.name}, ${x.zone}`} zone={x.zone} credit={x.photoCredit} href={source?.[1] ?? "#"} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap gap-1.5" data-reveal="fade">
            {x.gem && <Tag tone="gem"><Icon name="gem" size={13} />Gema</Tag>}
            {x.isNew && <Tag tone="primary"><Icon name="spark" size={13} />Nuevo hoy</Tag>}
            {x.drop > 0 && <Tag tone="warn"><Icon name="down" size={13} />Bajó {usd(x.drop)}</Tag>}
            <Tag><Icon name="pin" size={13} />{x.zone}</Tag>
          </div>
          <h1 className="t-display-sm mt-5" data-reveal>{x.name}</h1>
          <p className="num mt-4 text-4xl font-semibold text-ink" data-reveal>{usd(x.usd)}</p>
          <p className="mt-2 text-muted" data-reveal>{x.amb} ambientes · {num(x.total)} m² · {x.stage}</p>

          {/* El dato clave, visual: USD/m² del aviso contra la mediana del barrio */}
          <div className="card mt-7 p-5" data-reveal>
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-ink">USD por m² ponderado</p>
              {x.disc > 0 && <p className={`num text-2xl font-semibold ${x.gem ? "text-gem" : "text-ink"}`}>−{x.disc}%</p>}
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="mb-1 flex justify-between"><span className="text-text">Este aviso</span><span className="num font-semibold text-ink">{num(x.ppm)}</span></div>
                <div className="h-2.5 rounded-full bg-panel"><div className={`bar h-full rounded-full ${x.gem ? "bg-gem" : "bg-primary"}`} style={{ width: `${(x.ppm / max) * 100}%` }} /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between"><span className="text-text">Mediana de {x.zone}</span><span className="num font-semibold text-ink">{num(x.median)}</span></div>
                <div className="h-2.5 rounded-full bg-panel"><div className="bar h-full rounded-full bg-line-strong" style={{ width: `${(x.median / max) * 100}%` }} /></div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              m² ponderado = cubiertos + 50% de descubiertos ({num(x.pond)} m²). Gema es {GEM_THRESHOLD}% o más por debajo. <Link href="/metodologia/" className="link !text-muted">Cómo calculamos</Link>
            </p>
          </div>

          {source && (
            <div className="mt-6 flex flex-wrap items-center gap-4" data-reveal>
              <Button href={source[1]}>Ver aviso en {source[0]}</Button>
              {x.links.slice(1).map(([l, u]) => <Button key={u} href={u} variant="tertiary">{l}</Button>)}
            </div>
          )}
        </div>
      </section>

      <section className={`${container} pt-16`}>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <h2 className="t-h2" data-reveal>Ficha</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {facts.map((f, i) => (
                <div key={f.label} className="card flex gap-4 p-5" data-reveal style={{ ["--d" as string]: i % 2 }}>
                  <IconTile name={f.icon} tone={i % 2 ? "gem" : "primary"} />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{f.label}</dt>
                    <dd className="mt-1 font-semibold text-ink">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="card mt-6 flex gap-4 border-warn/40 bg-warn-soft p-5" data-reveal>
              <Icon name="info" className="mt-0.5 shrink-0 text-warn" />
              <div>
                <p className="font-semibold text-ink">Para tener en cuenta</p>
                <p className="mt-1 text-sm leading-relaxed text-text">{x.note}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6" data-reveal>
              <h2 className="t-h3">Historial de precio</h2>
              <ol className="mt-4 space-y-2.5">
                {[...x.hist].reverse().map(([d, p], k, arr) => {
                  const prev = arr[k + 1]?.[1];
                  return (
                    <li key={d} className="flex items-center justify-between text-sm">
                      <span className="text-muted">{longDate(d)}</span>
                      <span className="num font-semibold text-ink">
                        {usd(p)}
                        {prev && prev !== p && <span className={`ml-2 text-xs ${p < prev ? "text-gem" : "text-primary"}`}>{p < prev ? "▼" : "▲"} {usd(Math.abs(p - prev))}</span>}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-xs text-muted">En el listado desde el {longDate(x.first)}.</p>
            </div>

            <div className="card p-6" data-reveal>
              <h2 className="t-h3 flex items-center gap-2"><Icon name="shield" className="text-gem" />Antes de reservar</h2>
              <ul className="mt-4 space-y-3">
                {checklist.map((c) => (
                  <li key={c} className="flex gap-3 text-sm leading-relaxed text-text">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gem" />{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={`${container} pt-20`}>
        <SectionHeader eyebrow="Seguí mirando" title="Oportunidades parecidas" action={<Button href="/#oportunidades" variant="tertiary">Ver todas</Button>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related(x).map((r, i) => <OpportunityCard key={r.id} item={r} index={i} />)}
        </div>
        <Link href={`/oportunidades/${next.id}/`} className="card spotlight lift group mt-10 flex items-center justify-between gap-6 p-6" data-reveal>
          <div>
            <p className="t-eyebrow">Siguiente en el ranking</p>
            <p className="mt-2 text-xl font-bold text-ink">{next.name} · {next.zone}</p>
            <p className="num text-sm text-muted">{usd(next.usd)}{next.disc > 0 ? ` · −${next.disc}%` : ""}</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-ink transition-transform group-hover:translate-x-1"><Icon name="arrow" /></span>
        </Link>
      </section>
    </>
  );
}
