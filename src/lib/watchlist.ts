import type { CveItem, NewsItem, Watchlists } from "./types";

export function watchlistMatches(item: CveItem | NewsItem, watchlists: Watchlists) {
  const text = JSON.stringify(item).toLowerCase();
  return [...watchlists.vendors, ...watchlists.products, ...watchlists.keywords].some((term) =>
    term ? text.includes(term.toLowerCase()) : false,
  );
}
