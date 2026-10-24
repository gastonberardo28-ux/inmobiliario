import Link from "next/link";
import { items, longDate, num, stats, updated, usd, zones, GEM_THRESHOLD } from "@/lib/data";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Filters } from "@/components/Filters";
import { Photo } from "@/components/Photo";
import { Icon, IconTile } from "@/components/Icon";
import { Button, container, Hl, SectionHeader, Tag } from "@/components/ui";

export default function Home() {
  const top = items[0];
  const fresh = items.filter((x) => x.isNew);

  const statList = [
    { value: stats.total, label: "oportunidades activas" },
    { value: stats.gems, label: `gemas (−${GEM_THRESHOLD}% o más)` },
    { value: stats.bestDisc, label: "% mejor descuento", prefix: "−" },
    { value: stats.zones, label: "barrios cubiertos" },
  ];

  return (
    <>
      <PageHero
        size="lg"
        eyebrow={`Actualizado el ${longDate(updated)}`}
        title="Departamentos en pozo por debajo del precio de su barrio."
        lead={<p>{site.description}</p>}
        actions={
          <>
            <Button href="#oportunidades">Ver las {stats.total} oportunidades</Button>
            <Button href="/metodologia/" variant="tertiary">Cómo calculamos el descuento</Button>
          </>
        }
        aside={
          top && (
            <Link href={`/oportunidades/${top.id}/`} className="card spotlight lift group block">
              <div className="photo relative aspect-[4/3]">
                <Photo src={top.photos?.[0]} alt={`${top.name}, ${top.zone}`} zone={top.zone} eager />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4"><Tag tone="primary"><Icon name="gem" size={13} />La gema del día</Tag></div>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="flex items-center gap-1 text-sm font-medium opacity-90"><Icon name="pin" size={15} />{top.zone}</p>
                    <p className="mt-1 text-2xl font-bold tracking-tight">{top.name}</p>
                    <p className="num mt-1 text-lg">{usd(top.usd)} · {top.amb} amb. · {num(top.total)} m²</p>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-gem px-4 py-3 text-right">
                    <p className="num text-3xl font-semibold leading-none">−{top.disc}%</p>
                    <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider">vs. barrio</p>
                  </div>
                </div>
              </div>
            </Link>
          )
        }
      />

      {/* Banda de cifras: todas salen de los datos del día */}
      <section className="border-y border-line bg-surface">
        <div className={`${container} grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x`}>
          {statList.map((s, i) => (
            <div key={s.label} className="px-2 py-8 md:px-8" data-reveal style={{ ["--d" as string]: i }}>
              <p className="num text-4xl font-semibold text-ink md:text-5xl">
                {s.prefix}<span data-count={s.value}>{s.value}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {fresh.length > 0 && (
        <section className={`${container} pt-20`}>
          <SectionHeader eyebrow="Entraron hoy" title={<>Lo nuevo de <Hl>esta mañana</Hl></>} lead="Avisos que aparecieron en la última revisión diaria." />
          <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
            {fresh.map((x) => (
              <Link key={x.id} href={`/oportunidades/${x.id}/`} className="card lift group w-72 shrink-0 snap-start" data-reveal>
                <div className="photo relative aspect-[16/10]">
                  <Photo src={x.photos?.[0]} alt={`${x.name}, ${x.zone}`} zone={x.zone} />
                  {x.disc > 0 && <span className={`num absolute bottom-2 right-2 rounded-xl px-2 py-1 text-sm font-semibold ${x.gem ? "bg-gem text-white" : "bg-surface text-ink"}`}>−{x.disc}%</span>}
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-muted">{x.zone}</p>
                  <p className="font-bold text-ink">{x.name}</p>
                  <p className="num text-sm text-text">{usd(x.usd)} · {x.amb} amb.</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="oportunidades" className={`${container} scroll-mt-20 pt-20`}>
        <SectionHeader
          eyebrow="Ranking del día"
          title={<>Todas las oportunidades, ordenadas por <Hl>descuento</Hl></>}
          lead="El descuento compara el precio por m² del aviso con la mediana de su barrio. Tocá una tarjeta para ver fotos, financiación e historial de precio."
        />
        <Filters items={items} zones={zones} />
      </section>

      <section className={`${container} pt-24`}>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: "gem" as const, title: "Precio contra su barrio", text: "Cada aviso se mide en USD por m² ponderado contra la mediana de su barrio. Gema es un 15% o más por debajo." },
            { icon: "calendar" as const, title: "Revisión todas las mañanas", text: "Los avisos que se venden o se dan de baja salen del listado y los nuevos entran marcados como Nuevo." },
            { icon: "shield" as const, title: "Siempre con link a la fuente", text: "Mostramos hechos del aviso y el enlace original. Antes de reservar, verificá a la desarrolladora." },
          ].map((f, i) => (
            <div key={f.title} className="card spotlight p-6" data-reveal style={{ ["--d" as string]: i }}>
              <IconTile name={f.icon} tone={i === 0 ? "primary" : "gem"} />
              <h3 className="t-h3 mt-5">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center" data-reveal>
          <Button href="/metodologia/" variant="secondary">Ver la metodología completa</Button>
        </div>
      </section>
    </>
  );
}
