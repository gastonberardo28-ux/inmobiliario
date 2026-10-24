// Set propio de íconos: grilla 24, trazo único 1.75. Un concepto = un ícono en todo el sitio.
const paths: Record<string, string> = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  area: "M4 4h16v16H4zM4 9h5M15 20v-5h5",
  rooms: "M3 20V8l9-5 9 5v12M9 20v-6h6v6",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  crane: "M5 21V4l12 3M5 7h14M17 7v5M15 12h4v3h-4zM3 21h6",
  gem: "M6 3h12l3 6-9 12L3 9l3-6ZM3 9h18M9 3l3 18M15 3l-3 18",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  down: "M3 7l6 6 4-4 8 8M15 17h6v-6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  check: "M5 12.5l4.5 4.5L19 7",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  filter: "M4 6h16M7 12h10M10 18h4",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01",
  chevronL: "M15 6l-6 6 6 6",
  chevronR: "M9 6l6 6-6 6",
  building: "M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18",
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={paths[name]} />
    </svg>
  );
}

export function IconTile({ name, tone = "primary" }: { name: IconName; tone?: "primary" | "gem" }) {
  const cls = tone === "primary" ? "bg-primary-soft text-primary" : "bg-gem-soft text-gem";
  return (
    <span className={`inline-grid size-10 shrink-0 place-items-center rounded-xl ${cls}`}>
      <Icon name={name} />
    </span>
  );
}
