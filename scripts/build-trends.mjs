import { categoryRules } from "./utils.mjs";

const stopWords = new Set("the and for with from that this into about after before over under have has are was were will your you they them their its cyber security vulnerability vulnerabilities cve news attack attacks".split(" "));

export function buildTrends(cves, news, kev) {
  const keywordText = [...news.map((n) => `${n.title} ${n.summary}`), ...cves.map((c) => c.summary)].join(" ").toLowerCase();
  const words = keywordText.match(/[a-z][a-z0-9-]{2,}/g) || [];
  const topKeywords = count(words.filter((word) => !stopWords.has(word) && word.length > 3)).slice(0, 25).map(([keyword, count]) => ({ keyword, count }));
  const topVendors = count([...cves.map((c) => c.vendor).filter(Boolean), ...news.flatMap((n) => n.matchedVendors)]).slice(0, 20).map(([vendor, count]) => ({ vendor, count }));
  const topProducts = count([...cves.map((c) => c.product).filter(Boolean), ...news.flatMap((n) => n.matchedProducts)]).slice(0, 20).map(([product, count]) => ({ product, count }));
  const categoryDistribution = count(news.map((n) => n.category)).map(([category, count]) => ({ category, count }));
  for (const category of Object.keys(categoryRules)) if (!categoryDistribution.some((x) => x.category === category)) categoryDistribution.push({ category, count: 0 });
  const severityDistribution = ["Critical", "High", "Medium", "Low", "Unknown"].map((severity) => ({ severity, count: cves.filter((c) => c.severity === severity).length }));
  const sourceDistribution = count(news.map((n) => n.source)).map(([source, count]) => ({ source, count }));
  const epssBuckets = [
    { bucket: "Low", count: cves.filter((c) => c.epssPercentile < 0.5).length },
    { bucket: "Medium", count: cves.filter((c) => c.epssPercentile >= 0.5 && c.epssPercentile < 0.8).length },
    { bucket: "High", count: cves.filter((c) => c.epssPercentile >= 0.8 && c.epssPercentile < 0.9).length },
    { bucket: "Very High", count: cves.filter((c) => c.epssPercentile >= 0.9).length },
  ];
  const dates = [...new Set([...lastDays(30), ...cves.map((c) => c.published.slice(0, 10)), ...news.map((n) => n.published.slice(0, 10)), ...kev.map((k) => k.dateAdded)])].sort().slice(-30);
  const timeline = dates.map((date) => ({
    date,
    cves: cves.filter((c) => c.published.startsWith(date)).length,
    news: news.filter((n) => n.published.startsWith(date)).length,
    kev: kev.filter((k) => k.dateAdded === date).length,
  }));
  const vendors = Array.from(new Set(cves.map((c) => c.vendor).filter(Boolean))).slice(0, 12);
  const vendorSeverityHeatmap = vendors.map((vendor) => ({
    vendor,
    critical: cves.filter((c) => c.vendor === vendor && c.severity === "Critical").length,
    high: cves.filter((c) => c.vendor === vendor && c.severity === "High").length,
    medium: cves.filter((c) => c.vendor === vendor && c.severity === "Medium").length,
    low: cves.filter((c) => c.vendor === vendor && c.severity === "Low").length,
    unknown: cves.filter((c) => c.vendor === vendor && c.severity === "Unknown").length,
  }));
  return { generatedAt: new Date().toISOString(), topKeywords, topVendors, topProducts, categoryDistribution, severityDistribution, sourceDistribution, epssBuckets, timeline, vendorSeverityHeatmap };
}

function count(values) {
  const map = new Map();
  values.forEach((value) => map.set(value, (map.get(value) || 0) + 1));
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function lastDays(count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.now() - (count - index - 1) * 24 * 60 * 60 * 1000);
    return date.toISOString().slice(0, 10);
  });
}
