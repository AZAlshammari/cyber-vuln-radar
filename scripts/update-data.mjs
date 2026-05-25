import { mkdir, readFile } from "node:fs/promises";
import { fetchKev } from "./fetch-kev.mjs";
import { fetchCves } from "./fetch-cves.mjs";
import { fetchEpss } from "./enrich-epss.mjs";
import { fetchNews } from "./fetch-news.mjs";
import { buildTrends } from "./build-trends.mjs";
import { priorityScore, writeJson } from "./utils.mjs";
import { validateFiles } from "./schema.mjs";
import { sampleSnapshot } from "./sample-data.mjs";

const dataDir = new URL("../public/data/", import.meta.url);
await mkdir(dataDir, { recursive: true });

const previous = {
  cves: await readPrevious("cves.json"),
  kev: await readPrevious("kev.json"),
  news: await readPrevious("news.json"),
};
const sample = sampleSnapshot();

const errors = [];
const kevResult = await fetchKev();
if (kevResult.error) errors.push(`CISA KEV: ${kevResult.error.message}`);
if (!kevResult.items.length && previous.kev?.items?.length) {
  kevResult.items = previous.kev.items;
  kevResult.source.status = kevResult.source.status === "failed" ? "partial" : kevResult.source.status;
  kevResult.source.itemCount = kevResult.items.length;
  kevResult.source.error = joinErrors(kevResult.source.error, "Preserved previous KEV data because fetch returned no items.");
}
if (!kevResult.items.length) {
  kevResult.items = sample.kev;
  kevResult.source.status = "partial";
  kevResult.source.itemCount = kevResult.items.length;
  kevResult.source.error = joinErrors(kevResult.source.error, "Used bundled fallback KEV sample.");
}

const cveResult = await fetchCves();
if (cveResult.error) errors.push(`NVD: ${cveResult.error.message}`);
if (!cveResult.items.length && previous.cves?.items?.length) {
  cveResult.items = previous.cves.items;
  cveResult.source.status = cveResult.source.status === "failed" ? "partial" : cveResult.source.status;
  cveResult.source.itemCount = cveResult.items.length;
  cveResult.source.error = joinErrors(cveResult.source.error, "Preserved previous CVE data because fetch returned no items.");
}
if (!cveResult.items.length) {
  cveResult.items = sample.cves;
  cveResult.source.status = "partial";
  cveResult.source.itemCount = cveResult.items.length;
  cveResult.source.error = joinErrors(cveResult.source.error, "Used bundled fallback CVE sample.");
}

const kevMap = new Map(kevResult.items.map((item) => [item.cveID, item]));
const cves = cveResult.items.map((item) => {
  const kev = kevMap.get(item.id);
  const isKev = Boolean(kev);
  const knownRansomwareUse = /known|yes/i.test(kev?.knownRansomwareCampaignUse || "");
  return {
    ...item,
    isKev,
    kev: kev ? { vendorProject: kev.vendorProject, product: kev.product, vulnerabilityName: kev.vulnerabilityName, dateAdded: kev.dateAdded, dueDate: kev.dueDate, requiredAction: kev.requiredAction, knownRansomwareCampaignUse: kev.knownRansomwareCampaignUse, notes: kev.notes } : null,
    vendor: item.vendor || kev?.vendorProject || null,
    product: item.product || kev?.product || null,
    knownRansomwareUse,
  };
});

const epssResult = await fetchEpss(cves.map((item) => item.id));
if (epssResult.error) errors.push(`FIRST EPSS: ${epssResult.error.message}`);
for (const cve of cves) {
  const epss = epssResult.scores.get(cve.id);
  if (epss) Object.assign(cve, epss);
  cve.priorityScore = priorityScore(cve);
}
cves.sort((a, b) => b.priorityScore - a.priorityScore);

const newsResult = await fetchNews();
const failedNewsSources = newsResult.sources.filter((source) => source.status === "failed");
for (const source of failedNewsSources) errors.push(`${source.name}: ${source.error}`);
if (!newsResult.items.length && previous.news?.items?.length) {
  newsResult.items = previous.news.items;
  newsResult.sources.push({
    name: "Previous News Snapshot",
    type: "json",
    url: "public/data/news.json",
    status: "partial",
    lastFetchedAt: generatedNow(),
    lastSuccessfulFetchAt: previous.news.generatedAt || null,
    itemCount: newsResult.items.length,
    error: "Preserved previous news data because RSS fetch returned no items.",
    healthScore: 55,
  });
}
if (!newsResult.items.length) {
  newsResult.items = sample.news;
  newsResult.sources.push({
    name: "Bundled News Sample",
    type: "json",
    url: "scripts/sample-data.mjs",
    status: "partial",
    lastFetchedAt: generatedNow(),
    lastSuccessfulFetchAt: sample.generatedAt,
    itemCount: newsResult.items.length,
    error: "Used bundled fallback news sample.",
    healthScore: 55,
  });
}

const sources = [kevResult.source, cveResult.source, epssResult.source, ...newsResult.sources];
const trends = buildTrends(cves, newsResult.items, kevResult.items);
const failedSourceCount = sources.filter((source) => source.status === "failed").length;
const status = failedSourceCount === 0 ? "ok" : failedSourceCount === sources.length ? "failed" : "partial";
const newestCve = Math.max(0, ...cves.map((cve) => new Date(cve.published).getTime()));
const newestNews = Math.max(0, ...newsResult.items.map((item) => new Date(item.published).getTime()));
const ageMinutes = Math.min(Date.now() - newestCve, Date.now() - newestNews) / 60000;
const sourceHealth = Math.round((sources.reduce((sum, source) => sum + source.healthScore, 0) / Math.max(1, sources.length)));
const freshnessScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, ageMinutes - 15) * 1.5 - (100 - sourceHealth) * 0.35)));
const generatedAt = new Date().toISOString();

const files = {
  cves: { generatedAt, count: cves.slice(0, 1000).length, items: cves.slice(0, 1000) },
  kev: { generatedAt, count: kevResult.items.length, items: kevResult.items },
  news: { generatedAt, count: newsResult.items.slice(0, 500).length, items: newsResult.items.slice(0, 500) },
  trends,
  sources: { generatedAt, items: dedupeSources(sources) },
  meta: {
    generatedAt,
    lastSuccessfulUpdate: status === "failed" ? "" : generatedAt,
    status,
    freshnessScore,
    summary: {
      cveCount: cves.length,
      kevCount: kevResult.items.length,
      newsCount: newsResult.items.length,
      sourceCount: sources.length,
      failedSourceCount,
      criticalCount: cves.filter((cve) => cve.severity === "Critical").length,
      highCount: cves.filter((cve) => cve.severity === "High").length,
      highEpssCount: cves.filter((cve) => cve.epssPercentile >= 0.9).length,
      exploitAvailableCount: cves.filter((cve) => cve.exploitAvailable).length,
      patchAvailableCount: cves.filter((cve) => cve.patchAvailable).length,
    },
    errors,
  },
};

validateFiles(files);
await writeJson(new URL("cves.json", dataDir), files.cves);
await writeJson(new URL("kev.json", dataDir), files.kev);
await writeJson(new URL("news.json", dataDir), files.news);
await writeJson(new URL("trends.json", dataDir), files.trends);
await writeJson(new URL("sources.json", dataDir), files.sources);
await writeJson(new URL("meta.json", dataDir), files.meta);

console.log(`Updated data: ${files.cves.count} CVEs, ${files.kev.count} KEV, ${files.news.count} news, status ${status}`);

function dedupeSources(items) {
  const map = new Map();
  for (const item of items) map.set(item.name.toLowerCase(), item);
  return [...map.values()];
}

async function readPrevious(file) {
  try {
    return JSON.parse(await readFile(new URL(file, dataDir), "utf8"));
  } catch {
    return null;
  }
}

function joinErrors(...parts) {
  return parts.filter(Boolean).join(" ");
}

function generatedNow() {
  return new Date().toISOString();
}
