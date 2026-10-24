#!/usr/bin/env node
// Valida data/oportunidades.json antes de publicar.
// Uso: node scripts/validar.mjs [ruta]   (sin dependencias)
import { readFileSync } from "node:fs";

const ruta = process.argv[2] ?? new URL("../data/oportunidades.json", import.meta.url);
const D = JSON.parse(readFileSync(ruta, "utf8"));
const errores = [];
const avisos = [];

const fecha = /^\d{4}-\d{2}-\d{2}$/;
if (!fecha.test(D.updated ?? "")) errores.push(`"updated" debe ser YYYY-MM-DD (vino ${D.updated})`);
if (!D.medians || typeof D.medians !== "object") errores.push(`falta "medians"`);
if (!Array.isArray(D.items)) errores.push(`"items" debe ser una lista`);

const ids = new Set();
const requeridos = ["id", "name", "zone", "amb", "cub", "usd", "fin", "del", "stage", "dev", "note", "first", "hist", "links"];

for (const [i, x] of (D.items ?? []).entries()) {
  const ref = `items[${i}] (${x.id ?? x.name ?? "sin id"})`;
  for (const k of requeridos) if (x[k] === undefined || x[k] === "") errores.push(`${ref}: falta "${k}"`);
  if (ids.has(x.id)) errores.push(`${ref}: id duplicado`);
  ids.add(x.id);
  if (!D.medians?.[x.zone]) errores.push(`${ref}: la zona "${x.zone}" no tiene mediana`);
  if (!(x.usd >= 30000 && x.usd <= 250000)) errores.push(`${ref}: precio fuera de rango (${x.usd})`);
  if (!(x.cub >= 20 && x.cub <= 300)) errores.push(`${ref}: superficie cubierta fuera de rango (${x.cub})`);
  if (x.ext !== undefined && !(x.ext >= 0 && x.ext <= 200)) errores.push(`${ref}: superficie descubierta fuera de rango (${x.ext})`);
  if (!Number.isInteger(x.amb) || x.amb < 1 || x.amb > 6) errores.push(`${ref}: ambientes inválidos (${x.amb})`);
  if (!fecha.test(x.first ?? "")) errores.push(`${ref}: "first" debe ser YYYY-MM-DD`);
  if (!fecha.test(x.seen ?? "")) errores.push(`${ref}: falta "seen" (última fecha en que se verificó activo, YYYY-MM-DD)`);
  else if (x.seen < x.first) errores.push(`${ref}: "seen" es anterior a "first"`);
  if (!Array.isArray(x.hist) || !x.hist.length) errores.push(`${ref}: "hist" vacío`);
  else {
    const ult = x.hist[x.hist.length - 1];
    if (ult[1] !== x.usd) errores.push(`${ref}: el último precio de "hist" (${ult[1]}) no coincide con "usd" (${x.usd})`);
  }
  for (const l of x.links ?? []) {
    if (!Array.isArray(l) || l.length !== 2 || !/^https:\/\//.test(l[1])) errores.push(`${ref}: link inválido ${JSON.stringify(l)}`);
  }
  if (x.photos !== undefined) {
    if (!Array.isArray(x.photos) || x.photos.some((u) => typeof u !== "string" || !/^https:\/\//.test(u))) errores.push(`${ref}: "photos" debe ser una lista de URLs https`);
    else if (x.photos.length > 8) avisos.push(`${ref}: muchas fotos (${x.photos.length}); con 5 alcanza`);
    if (x.photos?.length && !x.photoCredit) errores.push(`${ref}: tiene fotos pero falta "photoCredit"`);
  } else avisos.push(`${ref}: sin fotos (la tarjeta muestra un placeholder)`);
  if ((x.note ?? "").length > 300) avisos.push(`${ref}: la nota es larga (${x.note.length} caracteres)`);
}

// Resumen con el mismo cálculo que la web.
const filas = (D.items ?? []).map((x) => {
  const pond = x.cub + 0.5 * (x.ext ?? 0);
  const disc = Math.round((1 - x.usd / pond / D.medians[x.zone]) * 100);
  return { disc, x };
}).sort((a, b) => b.disc - a.disc);

console.log(`Actualizado: ${D.updated} · ${filas.length} oportunidades · ${filas.filter((f) => f.disc >= 15).length} gemas`);
for (const { disc, x } of filas) {
  console.log(`${String(disc).padStart(4)}%  ${x.zone.padEnd(14)} ${String(x.amb).padStart(1)} amb  USD ${x.usd.toLocaleString("es-AR").padStart(8)}  ${x.name}`);
}
for (const a of avisos) console.warn("Aviso:", a);
if (errores.length) {
  for (const e of errores) console.error("Error:", e);
  process.exit(1);
}
