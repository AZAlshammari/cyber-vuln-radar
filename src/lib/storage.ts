import type { DashboardCardPreference, FilterState, Language, Theme, Watchlists } from "./types";

const prefix = "rasd-cybersecurity-platform:";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(prefix + key, JSON.stringify(value));
}

export const defaultFilters: FilterState = {
  search: "",
  severity: "",
  category: "",
  source: "",
  vendor: "",
  product: "",
  cwe: "",
  tags: "",
  kevOnly: false,
  exploitAvailable: false,
  patchAvailable: false,
  workaroundAvailable: false,
  recentlyPublished: false,
  recentlyModified: false,
  breakingOnly: false,
  watchlistOnly: false,
  minCvss: 0,
  minEpss: 0,
  timeRange: "7d",
  sort: "priority",
};

export const defaultWatchlists: Watchlists = {
  vendors: ["Microsoft", "Fortinet", "Ivanti"],
  products: ["Windows", "FortiOS", "Kubernetes"],
  keywords: ["zero-day", "ransomware", "supply chain"],
};

export const defaultDashboardCards: DashboardCardPreference[] = [
  "critical",
  "kev",
  "epss",
  "exploit",
  "patch",
  "news",
  "trend",
  "sources",
  "freshness",
].map((id, order) => ({ id, visible: true, order }));

export function getInitialTheme(): Theme {
  const saved = readStorage<Theme | null>("theme", null);
  if (saved) return saved;
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

export function getInitialLanguage(): Language {
  return readStorage<Language>("language", "ar");
}
