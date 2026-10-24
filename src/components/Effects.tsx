"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Motor de animación único. El contenido solo se oculta cuando corre JS (html.fx),
// y lo que ya está en pantalla al montar se marca enseguida: el hero nunca queda en blanco.
export function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("fx");

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])"));
    const vh = window.innerHeight;
    const pending: HTMLElement[] = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (reduce || (r.top < vh && r.bottom > 0)) el.setAttribute("data-in", "");
      else pending.push(el);
    }
    let io: IntersectionObserver | undefined;
    if (pending.length && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.setAttribute("data-in", "");
              io?.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      pending.forEach((el) => io!.observe(el));
    } else pending.forEach((el) => el.setAttribute("data-in", ""));

    // Contadores
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]:not([data-counted])"));
    const runCounter = (el: HTMLElement) => {
      el.setAttribute("data-counted", "");
      const end = Number(el.dataset.count);
      if (reduce || !end) return;
      const t0 = performance.now();
      const dur = 1100;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    let cio: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      cio = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { runCounter(e.target as HTMLElement); cio?.unobserve(e.target); }
      });
      counters.forEach((c) => cio!.observe(c));
    }

    return () => { io?.disconnect(); cio?.disconnect(); };
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest?.(".spotlight") as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const onScroll = () => {
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll", String(max > 0 ? window.scrollY / max : 0));
      if (window.scrollY > 8) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <div className="scrollbar" aria-hidden="true" />;
}
