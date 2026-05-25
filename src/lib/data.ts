import type { AppData } from "./types";

const base = import.meta.env.BASE_URL || "./";

async function getJson<T>(path: string, bust?: string): Promise<T> {
  const response = await fetch(`${base}data/${path}${bust ? `?v=${bust}` : ""}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json() as Promise<T>;
}

export async function loadAppData(bust?: string): Promise<AppData> {
  const [cves, kev, news, trends, sources, meta] = await Promise.all([
    getJson<AppData["cves"]>("cves.json", bust),
    getJson<AppData["kev"]>("kev.json", bust),
    getJson<AppData["news"]>("news.json", bust),
    getJson<AppData["trends"]>("trends.json", bust),
    getJson<AppData["sources"]>("sources.json", bust),
    getJson<AppData["meta"]>("meta.json", bust),
  ]);
  return { cves, kev, news, trends, sources, meta };
}
