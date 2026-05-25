import { XMLParser } from "fast-xml-parser";
import { rssFeeds } from "./config/sources.mjs";
import { canonicalizeUrl, categorize, detectTerms, extractCves, fetchText, hash, highRiskTerms, normalizeTitle, products, sanitizeText, sourceRecord, vendors } from "./utils.mjs";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

export async function fetchNews() {
  const items = [];
  const sources = [];
  for (const source of rssFeeds) {
    try {
      const xml = await fetchText(source, { timeout: 20000 });
      const parsed = parser.parse(xml);
      const feedItems = normalizeFeedItems(parsed).slice(0, 60).map((item) => normalizeNewsItem(item, source));
      items.push(...feedItems);
      sources.push(sourceRecord(source, "ok", feedItems.length));
    } catch (error) {
      sources.push(sourceRecord(source, "failed", 0, error.message));
    }
  }
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const deduped = dedupeNews(items.filter((item) => new Date(item.published).getTime() >= cutoff));
  return { items: deduped.slice(0, 500), sources };
}

function normalizeFeedItems(parsed) {
  if (parsed.rss?.channel?.item) return Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
  if (parsed.feed?.entry) return Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
  return [];
}

function normalizeNewsItem(item, source) {
  const rawLink = typeof item.link === "string" ? item.link : item.link?.href || item.guid || "";
  const url = canonicalizeUrl(rawLink);
  const title = sanitizeText(item.title || "");
  const summary = sanitizeText(item.description || item.summary || item.content || "");
  const text = `${title} ${summary}`;
  const category = categorize(text);
  const published = new Date(item.pubDate || item.published || item.updated || Date.now()).toISOString();
  const matchedVendors = detectTerms(text, vendors);
  const matchedProducts = detectTerms(text, products);
  const risk = highRiskTerms.some((term) => text.toLowerCase().includes(term)) || /breach|critical|emergency patch/i.test(text);
  const breaking = Date.now() - new Date(published).getTime() <= 2 * 60 * 60 * 1000 && risk;
  return {
    id: hash(url || normalizeTitle(title)),
    title,
    summary,
    source: source.name,
    category,
    published,
    url,
    canonicalUrl: url,
    tags: Array.from(new Set([category, ...matchedVendors, ...matchedProducts, ...extractCves(text)])),
    breaking,
    duplicateGroupId: null,
    relatedCves: extractCves(text),
    matchedVendors,
    matchedProducts,
  };
}

function dedupeNews(items) {
  const seen = new Map();
  const titleSeen = new Map();
  for (const item of items.sort((a, b) => new Date(b.published) - new Date(a.published))) {
    const titleKey = normalizeTitle(item.title);
    const existing = seen.get(item.canonicalUrl) || titleSeen.get(titleKey);
    if (existing) {
      existing.duplicateGroupId ||= hash(titleKey);
      continue;
    }
    seen.set(item.canonicalUrl, item);
    titleSeen.set(titleKey, item);
  }
  return Array.from(seen.values());
}
