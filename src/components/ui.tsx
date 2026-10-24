import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type BtnProps = { href: string; children: ReactNode; variant?: "primary" | "secondary" | "tertiary"; className?: string };

// Jerarquía clara de CTAs: primario sólido, secundario contorno verde, terciario link subrayado.
export function Button({ href, children, variant = "primary", className = "" }: BtnProps) {
  const external = /^https?:/.test(href);
  const icon = external ? "external" : "arrow";
  if (variant === "tertiary") {
    const inner = (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="link">{children}</span>
        <Icon name={icon} size={16} />
      </span>
    );
    return external ? <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a> : <Link href={href}>{inner}</Link>;
  }
  const cls = `btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`;
  const body = (
    <>
      <span className="relative">{children}</span>
      <Icon name={icon} size={17} className="arrow relative" />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
  ) : (
    <Link href={href} className={cls}>{body}</Link>
  );
}

export function SectionHeader({ eyebrow, title, lead, action }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-reveal>
      <div className="max-w-3xl">
        {eyebrow && <p className="t-eyebrow mb-4">{eyebrow}</p>}
        <h2 className="t-h2">{title}</h2>
        {lead && <p className="t-lead mt-4">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Hl({ children }: { children: ReactNode }) {
  return <span className="hl">{children}</span>;
}

export function Words({ text }: { text: string }) {
  return (
    <span className="words">
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ ["--w" as string]: i }}>
          {w}&nbsp;
        </span>
      ))}
    </span>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "primary" | "gem" | "warn" }) {
  const map = {
    neutral: "bg-surface/90 text-ink border-line",
    primary: "bg-primary text-primary-ink border-transparent",
    gem: "bg-gem-soft text-gem border-transparent",
    warn: "bg-warn-soft text-warn border-transparent",
  } as const;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.72rem] font-semibold ${map[tone]}`}>{children}</span>;
}

export const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
