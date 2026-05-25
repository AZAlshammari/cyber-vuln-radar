import type { FilterState } from "./types";
import { defaultFilters } from "./storage";

export function readFiltersFromUrl(): Partial<FilterState> {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const partial: Partial<FilterState> = {};
  for (const key of Object.keys(defaultFilters) as (keyof FilterState)[]) {
    const value = params.get(String(key));
    if (value == null) continue;
    if (typeof defaultFilters[key] === "boolean") partial[key] = (value === "true") as never;
    else if (typeof defaultFilters[key] === "number") partial[key] = Number(value) as never;
    else partial[key] = value as never;
  }
  return partial;
}

export function writeFiltersToUrl(path: string, filters: FilterState) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === "" || value === false || value === 0) continue;
    params.set(key, String(value));
  }
  location.hash = `${path}${params.toString() ? `?${params.toString()}` : ""}`;
}
