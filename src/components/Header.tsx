"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { container } from "./ui";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" || pathname.startsWith("/oportunidades") : pathname.startsWith(href));

  return (
    <header className="site-header sticky top-0 z-50 border-b border-transparent transition-colors">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-ink">
        Saltar al contenido
      </a>
      <div className={`${container} flex h-16 items-center justify-between gap-6`}>
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-ink" aria-label={`${site.name}, inicio`}>
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-ink">
            <Icon name="gem" size={18} />
          </span>
          <span className="text-[1.05rem]">{site.name}</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-ink aria-[current=page]:bg-panel aria-[current=page]:text-ink"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/#oportunidades" className="btn btn-primary ml-3 !py-2 !text-sm">
            <span className="relative">Ver gemas</span>
          </Link>
        </nav>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-line text-ink md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Principal" className="border-t border-line bg-bg md:hidden">
          <div className={`${container} flex flex-col gap-1 py-4`}>
            {site.nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className="rounded-xl px-4 py-3 text-lg font-semibold text-ink aria-[current=page]:bg-panel">
                {n.label}
              </Link>
            ))}
            <Link href="/#oportunidades" className="btn btn-primary mt-3 justify-center">
              <span className="relative">Ver gemas</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
