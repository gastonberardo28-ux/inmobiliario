// Única puerta de entrada a los datos. Lee data/oportunidades.json en el build
// (lo actualiza la tarea diaria) y calcula todo lo derivado en un solo lugar.
import raw from "../../data/oportunidades.json";

export type Link = [label: string, url: string];

export type RawItem = {
  id: string;
  name: string;
  zone: string;
  amb: number;
  cub: number;
  ext?: number;
  usd: number;
  fin: string;
  del: string;
  stage: string;
  dev: string;
  note: string;
  first: string;
  hist: [string, number][];
  links: Link[];
  photos?: string[];
  photoCredit?: string;
  seen?: string;
};

export type Item = RawItem & {
  ext: number;
  total: number;
  pond: number;
  ppm: number;
  median: number;
  disc: number;
  gem: boolean;
  isNew: boolean;
  drop: number;
  hasCuotas: boolean;
  source: string;
};

type Raw = { updated: string; medians: Record<string, number>; items: RawItem[] };
const D = raw as unknown as Raw;

export const GEM_THRESHOLD = 15;
// Un aviso que nadie verificó activo en más de estos días se oculta solo en el próximo build
// (el sitio se recompila todos los días aunque no haya datos nuevos).
export const MAX_DAYS_UNSEEN = 2;

const today = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
export const updated = D.updated;
export const medians = D.medians;

function enrich(x: RawItem): Item {
  const ext = x.ext ?? 0;
  const pond = x.cub + 0.5 * ext;
  const ppm = Math.round(x.usd / pond);
  const median = D.medians[x.zone] ?? 0;
  const disc = median ? Math.round((1 - ppm / median) * 100) : 0;
  const h = x.hist ?? [];
  const drop = h.length > 1 && h[h.length - 1][1] < h[h.length - 2][1] ? h[h.length - 2][1] - h[h.length - 1][1] : 0;
  return {
    ...x,
    ext,
    total: Math.round(x.cub + ext),
    pond: Math.round(pond),
    ppm,
    median,
    disc,
    gem: disc >= GEM_THRESHOLD,
    isNew: x.first === D.updated,
    drop,
    hasCuotas: /cuota/i.test(x.fin),
    source: x.links[0]?.[0].replace(/\s.*$/, "") ?? "",
  };
}

export const items: Item[] = D.items
  .filter((x) => daysBetween(x.seen ?? x.first, today) <= MAX_DAYS_UNSEEN)
  .map(enrich)
  .sort((a, b) => b.disc - a.disc);

// Días desde la última actualización completa; la home avisa si los datos se atrasan.
export const daysSinceUpdate = daysBetween(D.updated, today);

export function getItem(id: string) {
  return items.find((x) => x.id === id);
}

export function related(item: Item, n = 3) {
  return items.filter((x) => x.id !== item.id && x.zone === item.zone).concat(items.filter((x) => x.id !== item.id && x.zone !== item.zone && x.gem)).slice(0, n);
}

export function nextItem(item: Item) {
  const i = items.findIndex((x) => x.id === item.id);
  return items[(i + 1) % items.length];
}

export const stats = {
  total: items.length,
  gems: items.filter((x) => x.gem).length,
  fresh: items.filter((x) => x.isNew).length,
  zones: [...new Set(items.map((x) => x.zone))].length,
  bestDisc: items[0]?.disc ?? 0,
};

export const zones = [...new Set(items.map((x) => x.zone))].sort((a, b) => a.localeCompare(b, "es"));

// Formateadores compartidos.
export const usd = (n: number) => "USD " + n.toLocaleString("es-AR");
export const num = (n: number) => n.toLocaleString("es-AR");
export function longDate(iso: string) {
  return new Date(iso + "T12:00:00-03:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}
