import type { Metadata } from "next";
import { medians, num, GEM_THRESHOLD } from "@/lib/data";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { IconTile, type IconName } from "@/components/Icon";
import { Button, container, Hl, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Cómo calculamos",
  description: "Cómo elegimos los avisos, cómo medimos el precio por m² y qué significa que una oportunidad sea una gema.",
};

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: "spark", title: "1. Buscamos", text: `Cada mañana revisamos avisos de departamentos en pozo y en construcción en ${site.sources.join(", ")}, en ${site.zones.join(", ")}.` },
  { icon: "check", title: "2. Filtramos", text: "Dejamos solo 2 y 3 ambientes de hasta USD 200.000 con link activo. Descartamos usados mal etiquetados y unidades vendidas." },
  { icon: "area", title: "3. Medimos", text: "Calculamos USD por m² ponderado: superficie cubierta más la mitad de la descubierta (balcones, terrazas, patios)." },
  { icon: "gem", title: "4. Comparamos", text: `Comparamos contra la mediana del barrio. Si el aviso está ${GEM_THRESHOLD}% o más por debajo, lo marcamos como gema.` },
];

export default function Metodologia() {
  const rows = Object.entries(medians).sort((a, b) => b[1] - a[1]);
  const max = rows[0]?.[1] ?? 1;
  return (
    <>
      <PageHero eyebrow="Metodología" title="Cómo decidimos qué es una gema." lead={<p>Un solo criterio, el mismo para todos los avisos: cuánto se paga por m² contra lo que cuesta el barrio.</p>} />

      <section className={container}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card spotlight p-6" data-reveal style={{ ["--d" as string]: i }}>
              <IconTile name={s.icon} tone={i % 2 ? "gem" : "primary"} />
              <h2 className="t-h3 mt-5">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${container} pt-20`}>
        <SectionHeader eyebrow="La fórmula" title={<>Descuento = 1 − <Hl>USD/m² del aviso</Hl> ÷ mediana del barrio</>} />
        <div className="card p-6 md:p-8" data-reveal>
          <p className="t-h3">Medianas de referencia (USD por m²)</p>
          <div className="mt-6 space-y-3" data-reveal>
            {rows.map(([z, v]) => (
              <div key={z} className="grid grid-cols-[8.5rem_1fr_4rem] items-center gap-4 text-sm">
                <span className="text-text">{z}</span>
                <div className="h-2.5 rounded-full bg-panel"><div className="bar h-full rounded-full bg-primary" style={{ width: `${(v / max) * 100}%` }} /></div>
                <span className="num text-right font-semibold text-ink">{num(v)}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted">Medianas de avisos de venta de departamentos en cada barrio. Son una referencia, no una tasación. Las revisamos periódicamente.</p>
        </div>
      </section>

      <section className={`${container} pt-20`}>
        <SectionHeader eyebrow="Límites" title="Lo que esta métrica no mide" />
        <ul className="grid gap-4 md:grid-cols-2" data-reveal>
          {[
            "La solidez de quien construye. Eso lo tenés que verificar vos con el checklist de cada ficha.",
            "Si el precio publicado es el total o solo el anticipo. Lo marcamos cuando el aviso lo deja dudoso.",
            "Ubicación dentro del barrio, orientación, piso y calidad de terminaciones.",
            "Ajustes de cuotas por índice de la construcción (CAC) u otros.",
          ].map((t) => <li key={t} className="card p-5 text-sm leading-relaxed text-text">{t}</li>)}
        </ul>
        <div className="mt-10" data-reveal><Button href="/#oportunidades">Ver las oportunidades</Button></div>
      </section>
    </>
  );
}
