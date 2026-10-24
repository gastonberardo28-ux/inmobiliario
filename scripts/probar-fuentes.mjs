// Prueba temporal: qué responden los portales desde un servidor de GitHub.
import { readFileSync, writeFileSync } from "node:fs";
const D = JSON.parse(readFileSync("data/oportunidades.json", "utf8"));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const out = [];
async function probe(url) {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, "accept-language": "es-AR,es;q=0.9", accept: "text/html,application/json" }, redirect: "follow" });
    const t = await r.text();
    return { url, status: r.status, final: r.url, len: t.length, title: (t.match(/<title>([^<]*)/) || [])[1]?.slice(0, 120), snippet: t.slice(0, 300).replace(/\s+/g, " "), marks: ["pausada", "finalizada", "ya no está disponible", "no disponible", "postingId", "cf-chl", "captcha", "Just a moment", "\"status\""].filter((m) => t.includes(m)) };
  } catch (e) { return { url, error: String(e) }; }
}
for (const x of D.items.slice(0, 21)) {
  const u = x.links[0][1];
  out.push({ id: x.id, page: await probe(u) });
  const m = u.match(/MLA-?(\d+)/);
  if (m) out.push({ id: x.id, api: await probe(`https://api.mercadolibre.com/items/MLA${m[1]}`) });
}
writeFileSync("reporte.json", JSON.stringify(out, null, 1));
