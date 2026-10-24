import type { MetadataRoute } from "next";
import { items, updated } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  return [
    { url: `${base}/`, lastModified: updated, changeFrequency: "daily", priority: 1 },
    { url: `${base}/metodologia/`, lastModified: updated },
    { url: `${base}/aviso-legal/`, lastModified: updated },
    ...items.map((x) => ({ url: `${base}/oportunidades/${x.id}/`, lastModified: updated })),
  ];
}
