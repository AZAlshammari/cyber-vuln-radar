import { ArrowDown, ArrowUp } from "lucide-react";
import type { PageProps } from "./types";
import { useI18n } from "../i18n";
import { PageHeader } from "../components/dashboard/PageHeader";
import { Card, CardTitle } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
import { defaultFilters } from "../lib/storage";
import type { DashboardCardPreference, Watchlists } from "../lib/types";
import { useState } from "react";

export function Settings(props: PageProps) {
  const { t } = useI18n();
  const { language, setLanguage, theme, setTheme, filters, setFilters, watchlists, setWatchlists, dashboardCards, setDashboardCards } = props;
  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={t("settings")} description={t("settingsDescription")} />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardTitle>{t("language")}</CardTitle>
          <div className="mt-3">
            <Select value={language} onChange={(e) => setLanguage(e.target.value as "ar" | "en")}>
              <option value="ar">{t("arabic")}</option>
              <option value="en">{t("english")}</option>
            </Select>
          </div>
        </Card>
        <Card>
          <CardTitle>{t("theme")}</CardTitle>
          <div className="mt-3">
            <Select value={theme} onChange={(e) => setTheme(e.target.value as "dark" | "light" | "system")}>
              <option value="dark">{t("dark")}</option>
              <option value="light">{t("light")}</option>
              <option value="system">{t("system")}</option>
            </Select>
          </div>
        </Card>
        <Card>
          <CardTitle>{t("dashboardCustomization")}</CardTitle>
          <div className="mt-3 space-y-2">
            {[...dashboardCards].sort((a, b) => a.order - b.order).map((card, index, sorted) => (
              <div key={card.id} className="flex items-center gap-2 rounded-md border border-slate-200 p-2 dark:border-surface-700">
                <Toggle checked={card.visible} onChange={(visible) => setDashboardCards(updateCard(dashboardCards, card.id, { visible }))} label={t(cardLabel(card.id))} />
                <Button variant="ghost" aria-label={t("moveUp")} disabled={index === 0} onClick={() => setDashboardCards(reorder(sorted, index, -1))}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" aria-label={t("moveDown")} disabled={index === sorted.length - 1} onClick={() => setDashboardCards(reorder(sorted, index, 1))}><ArrowDown className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>{t("dataPreferences")}</CardTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs text-slate-500">{t("defaultTimeRange")}</span>
              <Select value={filters.timeRange} onChange={(e) => setFilters({ ...filters, timeRange: e.target.value as typeof filters.timeRange })}>
                <option value="24h">{t("last24h")}</option>
                <option value="7d">{t("last7d")}</option>
                <option value="14d">{t("last14d")}</option>
                <option value="30d">{t("last30d")}</option>
              </Select>
            </label>
            <label>
              <span className="mb-1 block text-xs text-slate-500">{t("defaultSort")}</span>
              <Select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                {["priority", "newest", "cvss", "epss", "kev", "severity", "source", "category"].map((sort) => <option key={sort} value={sort}>{t(sort)}</option>)}
              </Select>
            </label>
          </div>
          <Button className="mt-3" variant="ghost" onClick={() => setFilters(defaultFilters)}>{t("resetFilters")}</Button>
        </Card>
        <WatchlistEditor title={t("vendorWatchlist")} field="vendors" watchlists={watchlists} setWatchlists={setWatchlists} />
        <WatchlistEditor title={t("productWatchlist")} field="products" watchlists={watchlists} setWatchlists={setWatchlists} />
        <WatchlistEditor title={t("keywordWatchlist")} field="keywords" watchlists={watchlists} setWatchlists={setWatchlists} />
        <SavedFilters filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
}

function WatchlistEditor({
  title,
  field,
  watchlists,
  setWatchlists,
}: {
  title: string;
  field: keyof Watchlists;
  watchlists: Watchlists;
  setWatchlists: (watchlists: Watchlists) => void;
}) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const add = () => {
    if (!value.trim()) return;
    setWatchlists({ ...watchlists, [field]: Array.from(new Set([...watchlists[field], value.trim()])) });
    setValue("");
  };
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <div className="mt-3 flex gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={title} />
        <Button onClick={add}>{t("addItem")}</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {watchlists[field].map((item) => (
          <button key={item} className="rounded-md border border-slate-200 px-2 py-1 text-sm dark:border-surface-700" onClick={() => setWatchlists({ ...watchlists, [field]: watchlists[field].filter((x) => x !== item) })}>
            {item} ×
          </button>
        ))}
      </div>
    </Card>
  );
}

function SavedFilters({ filters, setFilters }: Pick<PageProps, "filters" | "setFilters">) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<Record<string, typeof filters>>(() => {
    try {
      return JSON.parse(localStorage.getItem("rasd-cybersecurity-platform:savedFilters") || "{}");
    } catch {
      return {};
    }
  });
  const persist = (next: Record<string, typeof filters>) => {
    setSaved(next);
    localStorage.setItem("rasd-cybersecurity-platform:savedFilters", JSON.stringify(next));
  };
  return (
    <Card>
      <CardTitle>{t("savedFilters")}</CardTitle>
      <div className="mt-3 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("filterName")} />
        <Button onClick={() => name.trim() && persist({ ...saved, [name.trim()]: filters })}>{t("saveFilter")}</Button>
      </div>
      <div className="mt-3 space-y-2">
        {Object.entries(saved).map(([filterName, value]) => (
          <div key={filterName} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 p-2 dark:border-surface-700">
            <span>{filterName}</span>
            <span className="flex gap-2">
              <Button variant="ghost" onClick={() => setFilters(value)}>{t("apply")}</Button>
              <Button variant="danger" onClick={() => {
                const next = { ...saved };
                delete next[filterName];
                persist(next);
              }}>{t("delete")}</Button>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function updateCard(cards: DashboardCardPreference[], id: string, patch: Partial<DashboardCardPreference>) {
  return cards.map((card) => (card.id === id ? { ...card, ...patch } : card));
}

function reorder(cards: DashboardCardPreference[], index: number, direction: number) {
  const next = cards.slice();
  const target = index + direction;
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((card, order) => ({ ...card, order }));
}

function cardLabel(id: string) {
  return {
    critical: "criticalVulnerabilities",
    kev: "knownExploited",
    epss: "highEpss",
    exploit: "exploitAvailable",
    patch: "patchAvailable",
    news: "latestNews",
    trend: "trendingTopic",
    sources: "sourceHealth",
    freshness: "dataFreshness",
  }[id] || id;
}
