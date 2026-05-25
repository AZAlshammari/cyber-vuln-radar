import type { FilterState } from "../../lib/types";
import { useI18n } from "../../i18n";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";

export function FilterBar({
  filters,
  setFilters,
  vendors,
  products,
  categories,
  sources,
  onReset,
}: {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  vendors?: string[];
  products?: string[];
  categories?: string[];
  sources?: string[];
  onReset: () => void;
}) {
  const { t } = useI18n();
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => setFilters({ ...filters, [key]: value });
  return (
    <section className="sticky top-16 z-20 mb-5 rounded-lg border border-slate-200 bg-white/95 p-3 backdrop-blur dark:border-surface-800 dark:bg-surface-900/95">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <label className="xl:col-span-2">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t("search")}</span>
          <Input value={filters.search} onChange={(e) => update("search", e.target.value)} placeholder={t("search")} />
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">{t("severity")}</span>
          <Select value={filters.severity} onChange={(e) => update("severity", e.target.value)}>
            <option value="">{t("all")}</option>
            {["Critical", "High", "Medium", "Low", "Unknown"].map((severity) => (
              <option key={severity} value={severity}>{t(severity.toLowerCase())}</option>
            ))}
          </Select>
        </label>
        {categories ? (
          <label>
            <span className="mb-1 block text-xs font-medium text-slate-500">{t("category")}</span>
            <Select value={filters.category} onChange={(e) => update("category", e.target.value)}>
              <option value="">{t("all")}</option>
              {categories.map((category) => <option key={category} value={category}>{t(`cat.${category}`)}</option>)}
            </Select>
          </label>
        ) : null}
        {sources ? (
          <label>
            <span className="mb-1 block text-xs font-medium text-slate-500">{t("source")}</span>
            <Select value={filters.source} onChange={(e) => update("source", e.target.value)}>
              <option value="">{t("all")}</option>
              {sources.map((source) => <option key={source} value={source}>{source}</option>)}
            </Select>
          </label>
        ) : null}
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">{t("vendor")}</span>
          <Select value={filters.vendor} onChange={(e) => update("vendor", e.target.value)}>
            <option value="">{t("all")}</option>
            {(vendors || []).map((vendor) => <option key={vendor} value={vendor}>{vendor}</option>)}
          </Select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">{t("product")}</span>
          <Select value={filters.product} onChange={(e) => update("product", e.target.value)}>
            <option value="">{t("all")}</option>
            {(products || []).map((product) => <option key={product} value={product}>{product}</option>)}
          </Select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">{t("minCvss")}</span>
          <Input type="number" min={0} max={10} value={filters.minCvss} onChange={(e) => update("minCvss", Number(e.target.value))} />
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">{t("minEpss")}</span>
          <Input type="number" min={0} max={100} value={filters.minEpss} onChange={(e) => update("minEpss", Number(e.target.value))} />
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">{t("timeRange")}</span>
          <Select value={filters.timeRange} onChange={(e) => update("timeRange", e.target.value as FilterState["timeRange"])}>
            <option value="24h">{t("last24h")}</option>
            <option value="7d">{t("last7d")}</option>
            <option value="14d">{t("last14d")}</option>
            <option value="30d">{t("last30d")}</option>
          </Select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">{t("sortBy")}</span>
          <Select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
            {["priority", "newest", "modified", "cvss", "epss", "kev", "severity", "vendor", "product", "source", "category"].map((sort) => (
              <option key={sort} value={sort}>{t(sort)}</option>
            ))}
          </Select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle checked={filters.kevOnly} onChange={(v) => update("kevOnly", v)} label={t("kevOnly")} />
        <Toggle checked={filters.exploitAvailable} onChange={(v) => update("exploitAvailable", v)} label={t("exploitAvailable")} />
        <Toggle checked={filters.patchAvailable} onChange={(v) => update("patchAvailable", v)} label={t("patchAvailable")} />
        <Toggle checked={filters.recentlyPublished} onChange={(v) => update("recentlyPublished", v)} label={t("recentlyPublished")} />
        <Toggle checked={filters.breakingOnly} onChange={(v) => update("breakingOnly", v)} label={t("breakingOnly")} />
        <Toggle checked={filters.watchlistOnly} onChange={(v) => update("watchlistOnly", v)} label={t("watchlistOnly")} />
        <Button variant="ghost" onClick={onReset}>{t("resetFilters")}</Button>
      </div>
    </section>
  );
}
