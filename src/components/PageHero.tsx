import type { ReactNode } from "react";
import { container, Words } from "./ui";

// Un único hero para todas las páginas: eyebrow, título palabra por palabra, bajada, acciones.
export function PageHero({ eyebrow, title, lead, actions, aside, size = "sm" }: { eyebrow?: string; title: string; lead?: ReactNode; actions?: ReactNode; aside?: ReactNode; size?: "lg" | "sm" }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="hero-bg" aria-hidden="true">
        <div className="dots" />
        <div className="halo a" />
        <div className="halo b" />
      </div>
      <div className={`${container} ${size === "lg" ? "pb-16 pt-14 md:pb-24 md:pt-24" : "pb-12 pt-12 md:pb-16 md:pt-20"} ${aside ? "grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]" : ""}`}>
        <div>
          {eyebrow && <p className="t-eyebrow mb-6" data-reveal="fade">{eyebrow}</p>}
          <h1 className={size === "lg" ? "t-display" : "t-display-sm"}>
            <Words text={title} />
          </h1>
          {lead && <div className="t-lead mt-6" data-reveal style={{ ["--d" as string]: 3 }}>{lead}</div>}
          {actions && <div className="mt-9 flex flex-wrap items-center gap-4" data-reveal style={{ ["--d" as string]: 5 }}>{actions}</div>}
        </div>
        {aside && <div data-reveal="scale" style={{ ["--d" as string]: 4 }}>{aside}</div>}
      </div>
    </section>
  );
}
