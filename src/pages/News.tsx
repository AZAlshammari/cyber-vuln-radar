import { useMemo } from "react";
import type { PageProps } from "./types";
import { useI18n } from "../i18n";
import { PageHeader } from "../components/dashboard/PageHeader";
import { FilterBar } from "../components/vulnerabilities/FilterBar";
import { NewsFeed } from "../components/news/NewsFeed";
import { Button } from "../components/ui/Button";
import { defaultFilters } from "../lib/storage";
import { filterNews } from "../lib/filters";
import { exportCsv, exportJson } from "../lib/export";

export function News(props: PageProps) {
  const { data, filters, setFilters, watchlists } = props;
  const { t } = useI18n();
  const categories = useMemo(() => Array.from(new Set(data.news.items.map((i) => i.category))), [data]);
  const sources = useMemo(() => Array.from(new Set(data.news.items.map((i) => i.source))), [data]);
  const filtered = useMemo(() => filterNews(data.news.items, filters, watchlists), [data, filters, watchlists]);
  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title={t("cyberNews")}
        description={t("newsDescription")}
        actions={
          <>
            <Button onClick={() => exportCsv("news.csv", filtered as unknown as Record<string, unknown>[])}>{t("exportCsv")}</Button>
            <Button onClick={() => exportJson("news.json", filtered)}>{t("exportJson")}</Button>
          </>
        }
      />
      <FilterBar filters={filters} setFilters={setFilters} categories={categories} sources={sources} onReset={() => setFilters(defaultFilters)} />
      <NewsFeed items={filtered} />
    </div>
  );
}
