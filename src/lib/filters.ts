import type { CveItem, FilterState, NewsItem, Watchlists } from "./types";
import { watchlistMatches } from "./watchlist";

function inRange(date: string, range: FilterState["timeRange"]) {
  const days = range === "24h" ? 1 : Number(range.replace("d", ""));
  return Date.now() - new Date(date).getTime() <= days * 24 * 60 * 60 * 1000;
}

export function filterCves(items: CveItem[], filters: FilterState, watchlists: Watchlists) {
  const search = filters.search.toLowerCase();
  return items
    .filter((item) => !search || JSON.stringify(item).toLowerCase().includes(search))
    .filter((item) => !filters.severity || item.severity === filters.severity)
    .filter((item) => !filters.vendor || item.vendor === filters.vendor)
    .filter((item) => !filters.product || item.product === filters.product)
    .filter((item) => !filters.cwe || item.cwe.some((cwe) => cwe.id === filters.cwe))
    .filter((item) => !filters.tags || item.tags.includes(filters.tags))
    .filter((item) => !filters.kevOnly || item.isKev)
    .filter((item) => !filters.exploitAvailable || item.exploitAvailable)
    .filter((item) => !filters.patchAvailable || item.patchAvailable)
    .filter((item) => !filters.workaroundAvailable || item.workaroundAvailable)
    .filter((item) => !filters.recentlyPublished || item.recentlyPublished)
    .filter((item) => !filters.recentlyModified || item.recentlyModified)
    .filter((item) => item.cvssScore >= filters.minCvss)
    .filter((item) => item.epssPercentile * 100 >= filters.minEpss)
    .filter((item) => inRange(item.published, filters.timeRange))
    .filter((item) => !filters.watchlistOnly || watchlistMatches(item, watchlists))
    .sort((a, b) => sortCves(a, b, filters.sort));
}

function sortCves(a: CveItem, b: CveItem, sort: string) {
  const severityRank = { Critical: 5, High: 4, Medium: 3, Low: 2, Unknown: 1 };
  switch (sort) {
    case "newest":
    case "published":
      return new Date(b.published).getTime() - new Date(a.published).getTime();
    case "modified":
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    case "cvss":
      return b.cvssScore - a.cvssScore;
    case "epss":
      return b.epssPercentile - a.epssPercentile;
    case "kev":
      return Number(b.isKev) - Number(a.isKev);
    case "severity":
      return severityRank[b.severity] - severityRank[a.severity];
    case "vendor":
      return String(a.vendor).localeCompare(String(b.vendor));
    case "product":
      return String(a.product).localeCompare(String(b.product));
    default:
      return b.priorityScore - a.priorityScore;
  }
}

export function filterNews(items: NewsItem[], filters: FilterState, watchlists: Watchlists) {
  const search = filters.search.toLowerCase();
  return items
    .filter((item) => !search || JSON.stringify(item).toLowerCase().includes(search))
    .filter((item) => !filters.category || item.category === filters.category)
    .filter((item) => !filters.source || item.source === filters.source)
    .filter((item) => !filters.tags || item.tags.includes(filters.tags))
    .filter((item) => !filters.breakingOnly || item.breaking)
    .filter((item) => !filters.watchlistOnly || watchlistMatches(item, watchlists))
    .filter((item) => inRange(item.published, filters.timeRange))
    .sort((a, b) => {
      if (filters.sort === "source") return a.source.localeCompare(b.source);
      if (filters.sort === "category") return a.category.localeCompare(b.category);
      return new Date(b.published).getTime() - new Date(a.published).getTime();
    });
}
