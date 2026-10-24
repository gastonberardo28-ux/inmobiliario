#!/usr/bin/env node
// Chequeo diario automático de los avisos de Mercado Libre (corre en GitHub Actions).
// - Si el aviso está pausado, finalizado o no existe: lo saca del listado.
// - Si sigue activo: marca "seen" con la fecha de hoy.
// Zonaprop no se puede chequear desde un servidor (pide verificación anti-bot), así que
// esos avisos los verifica la tarea diaria con Chrome. Un pedido por aviso, con pausa entre pedidos.
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const ruta = new URL("../data/oportunidades.json", import.meta.url);
const D = JSON.parse(readFileSync(ruta, "utf8"));
const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
// Un aviso vivo trae "status":"active" en su JSON. Pausado o finalizado trae paused/closed/inactive
// o el cartel visible. Un aviso inexistente redirige fuera de su id.
const ACTIVO = /"status":"active"/;
const CAIDO = /"status":"(paused|closed|inactive)"|Publicaci[oó]n (pausada|finalizada)/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const bajas = [];
const activos = [];
const dudosos = [];

for (const x of D.items) {
  const link = x.links.find(([l]) => l.startsWith("Mercado Libre"));
  if (!link || x.links[0] !== link) continue;
  const id = link[1].match(/MLA-?(\d+)/)?.[1];
  try {
    const r = await fetch(link[1], { headers: { "user-agent": UA, "accept-language": "es-AR,es;q=0.9" }, redirect: "follow" });
    const html = r.status === 200 ? await r.text() : "";
    const sigueEnElAviso = id && r.url.includes(id);
    if (r.status === 404 || r.status === 410 || (r.status === 200 && !sigueEnElAviso)) bajas.push(x);
    else if (r.status === 200 && ACTIVO.test(html) && !CAIDO.test(html)) { x.seen = hoy; activos.push(x.id); }
    else if (r.status === 200 && CAIDO.test(html) && !ACTIVO.test(html)) bajas.push(x);
    else dudosos.push(`${x.id} (HTTP ${r.status})`);
  } catch (e) {
    dudosos.push(`${x.id} (${e.message})`);
  }
  await sleep(1500);
}

// Freno de seguridad: si "se cayó" más de la mitad de golpe, lo más probable es que Mercado Libre
// haya bloqueado el chequeo, no que se hayan vendido todos. En ese caso no se borra nada.
const chequeados = bajas.length + activos.length + dudosos.length;
if (bajas.length > 1 && bajas.length > chequeados / 2) {
  dudosos.push(...bajas.map((x) => `${x.id} (parecía baja, se frenó por seguridad)`));
  bajas.length = 0;
}

if (bajas.length) {
  const fuera = new Set(bajas.map((x) => x.id));
  D.items = D.items.filter((x) => !fuera.has(x.id));
}
if (bajas.length || activos.length) writeFileSync(ruta, JSON.stringify(D, null, 2) + "\n");

const resumen = [
  `Mercado Libre: ${activos.length} activos, ${bajas.length} bajas, ${dudosos.length} sin respuesta clara.`,
  ...bajas.map((x) => `Baja: ${x.name} (${x.zone})`),
  ...dudosos.map((d) => `Sin respuesta clara, no se toca: ${d}`),
].join("\n");
console.log(resumen);
// Reporte legible del último chequeo (también fuerza un commit diario, que redeploya Vercel).
writeFileSync(new URL("../data/ultimo-chequeo.json", import.meta.url), JSON.stringify({ fecha: hoy, hora: new Date().toISOString(), activos, bajas: bajas.map((x) => x.id), dudosos }, null, 2) + "\n");
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `bajas=${bajas.length}\n`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, resumen.replace(/\n/g, "\n\n") + "\n");
