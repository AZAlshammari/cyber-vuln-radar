import { useMemo } from "react";
import type { PageProps } from "./types";
import { useI18n } from "../i18n";
import { PageHeader } from "../components/dashboard/PageHeader";
import { FilterBar } from "../components/vulnerabilities/FilterBar";
import { CveTable } from "../components/vulnerabilities/CveTable";
import { Button } from "../components/ui/Button";
import { defaultFilters } from "../lib/storage";
import { filterCves } from "../lib/filters";
import { exportCsv, exportJson } from "../lib/export";

export function Vulnerabilities(props: PageProps) {
  const { data, filters, setFilters, watchlists } = props;
  const { t } = useI18n();
  const vendors = useMemo(() => Array.from(new Set(data.cves.items.map((i) => i.vendor).filter(Boolean))) as string[], [data]);
  const products = useMemo(() => Array.from(new Set(data.cves.items.map((i) => i.product).filter(Boolean))) as string[], [data]);
  const filtered = useMemo(() => filterCves(data.cves.items, filters, watchlists), [data, filters, watchlists]);
  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title={t("vulnerabilities")}
        description={t("vulnerabilitiesDescription")}
        actions={
          <>
            <Button onClick={() => exportCsv("cves.csv", filtered as unknown as Record<string, unknown>[])}>{t("exportCsv")}</Button>
            <Button onClick={() => exportJson("cves.json", filtered)}>{t("exportJson")}</Button>
          </>
        }
      />
      <FilterBar filters={filters} setFilters={setFilters} vendors={vendors} products={products} onReset={() => setFilters(defaultFilters)} />
      <CveTable items={filtered} />
    </div>
  );
}
