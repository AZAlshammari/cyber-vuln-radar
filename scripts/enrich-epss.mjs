import { apiSources } from "./config/sources.mjs";
import { fetchJson, sourceRecord } from "./utils.mjs";

export async function fetchEpss(cveIds) {
  const source = apiSources.find((item) => item.name === "FIRST EPSS");
  if (!cveIds.length) return { scores: new Map(), source: sourceRecord(source, "partial", 0, "No CVE IDs to enrich") };
  try {
    const scores = new Map();
    const chunks = [];
    for (let i = 0; i < cveIds.length; i += 100) chunks.push(cveIds.slice(i, i + 100));
    for (const chunk of chunks) {
      const url = `${source.url}?cve=${chunk.join(",")}`;
      const data = await fetchJson({ ...source, url });
      for (const item of data.data || []) {
        scores.set(item.cve, { epssScore: Number(item.epss || 0), epssPercentile: Number(item.percentile || 0) });
      }
    }
    return { scores, source: sourceRecord(source, "ok", scores.size) };
  } catch (error) {
    return { scores: new Map(), source: sourceRecord(source, "failed", 0, error.message), error };
  }
}
