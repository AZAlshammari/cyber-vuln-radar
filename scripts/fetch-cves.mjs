import { apiSources } from "./config/sources.mjs";
import { detectTerms, fetchJson, inferFlags, isoDate, mapCwe, parseCvssVector, priorityScore, products, sanitizeText, sourceRecord, vendors } from "./utils.mjs";

export async function fetchCves() {
  const source = apiSources.find((item) => item.name === "NVD CVE API 2.0");
  const end = new Date();
  const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
  const headers = process.env.NVD_API_KEY ? { apiKey: process.env.NVD_API_KEY } : {};
  try {
    const all = [];
    let startIndex = 0;
    let total = 1;
    while (startIndex < total && all.length < 1000) {
      const url = `${source.url}?pubStartDate=${encodeURIComponent(start.toISOString())}&pubEndDate=${encodeURIComponent(end.toISOString())}&startIndex=${startIndex}&resultsPerPage=200`;
      const data = await fetchJson({ ...source, url }, { headers, timeout: 30000 });
      total = Math.min(data.totalResults || 0, 1000);
      all.push(...(data.vulnerabilities || []));
      startIndex += data.resultsPerPage || 200;
      if (!process.env.NVD_API_KEY) await new Promise((resolve) => setTimeout(resolve, 6500));
    }
    return { items: all.map(normalizeNvdCve), source: sourceRecord(source, "ok", all.length) };
  } catch (error) {
    return { items: [], source: sourceRecord(source, "failed", 0, error.message), error };
  }
}

export function normalizeNvdCve(entry) {
  const cve = entry.cve || {};
  const metrics = cve.metrics || {};
  const metric = metrics.cvssMetricV31?.[0] || metrics.cvssMetricV30?.[0] || metrics.cvssMetricV2?.[0] || {};
  const cvss = metric.cvssData || {};
  const references = (cve.references?.referenceData || []).map((ref) => ref.url).filter(Boolean);
  const summary = sanitizeText(cve.descriptions?.find((d) => d.lang === "en")?.value || cve.descriptions?.[0]?.value || "");
  const cweIds = (cve.weaknesses || [])
    .flatMap((weakness) => weakness.description || [])
    .map((item) => item.value)
    .filter((value) => /^CWE-\d+$/i.test(value));
  const cpeText = JSON.stringify(cve.configurations || {});
  const vendorMatches = detectTerms(`${summary} ${cpeText}`, vendors);
  const productMatches = detectTerms(`${summary} ${cpeText}`, products);
  const flags = inferFlags(summary, references);
  const published = isoDate(cve.published);
  const lastModified = isoDate(cve.lastModified);
  return {
    id: cve.id,
    summary,
    published,
    lastModified,
    severity: normalizeSeverity(metric.cvssData?.baseSeverity || metric.baseSeverity),
    cvssScore: Number(cvss.baseScore || 0),
    cvssVector: cvss.vectorString || null,
    cvssBreakdown: parseCvssVector(cvss.vectorString),
    epssScore: 0,
    epssPercentile: 0,
    isKev: false,
    kev: null,
    vendor: vendorMatches[0] || null,
    product: productMatches[0] || null,
    cwe: Array.from(new Set(cweIds)).map(mapCwe),
    references,
    vendorAdvisoryLinks: references.filter((url) => /advisory|security|support|update|release/i.test(url)),
    ...flags,
    recentlyPublished: Date.now() - new Date(published).getTime() <= 48 * 60 * 60 * 1000,
    recentlyModified: Date.now() - new Date(lastModified).getTime() <= 48 * 60 * 60 * 1000,
    knownRansomwareUse: false,
    priorityScore: priorityScore({ cvssScore: Number(cvss.baseScore || 0), published, summary }),
    tags: Array.from(new Set([...vendorMatches, ...productMatches, ...cweIds])),
  };
}

function normalizeSeverity(value) {
  const upper = String(value || "").toUpperCase();
  if (upper === "CRITICAL") return "Critical";
  if (upper === "HIGH") return "High";
  if (upper === "MEDIUM") return "Medium";
  if (upper === "LOW") return "Low";
  return "Unknown";
}
