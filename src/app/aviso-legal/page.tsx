import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Alcance de la información publicada, uso de fotos y cómo pedir la baja de un aviso.",
};

const sections = [
  { h: "Qué es este sitio", p: `${site.name} reúne avisos públicos de departamentos en pozo y en construcción y los ordena por precio por m² frente a su barrio. Es información, no una oferta de venta ni una recomendación de inversión.` },
  { h: "Exactitud", p: "Los datos salen de los avisos tal como están publicados el día de la revisión. Precios, superficies y condiciones pueden cambiar o contener errores del anunciante. Confirmá todo con quien vende antes de decidir." },
  { h: "Fotos y marcas", p: "Las fotos pertenecen a los avisos originales y a sus autores. Se muestran como vista previa, con crédito y enlace a la publicación de origen. Las marcas citadas pertenecen a sus dueños." },
  { h: "Pedir una baja o corrección", p: `Si sos anunciante o desarrollador y querés que quitemos una foto, corrijamos un dato o demos de baja una publicación, escribí a ${site.contact}. Lo resolvemos en el día.` },
  { h: "No es asesoramiento", p: "Nada de lo publicado es asesoramiento financiero, legal ni impositivo. Consultá con profesionales matriculados antes de invertir." },
];

export default function AvisoLegal() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Aviso legal." lead={<p>Qué mostramos, de dónde sale y cómo pedir cambios.</p>} />
      <section className={container}>
        <div className="card max-w-3xl divide-y divide-line">
          {sections.map((s) => (
            <div key={s.h} className="p-6 md:p-8" data-reveal>
              <h2 className="t-h3">{s.h}</h2>
              <p className="mt-2 leading-relaxed text-text">{s.p}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Contacto: <a className="link" href={`mailto:${site.contact}`}>{site.contact}</a>
        </p>
      </section>
    </>
  );
}
