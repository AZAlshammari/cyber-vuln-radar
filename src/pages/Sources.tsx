import type { PageProps } from "./types";
import { useI18n } from "../i18n";
import { PageHeader } from "../components/dashboard/PageHeader";
import { SourceHealth } from "../components/sources/SourceHealth";

export function Sources({ data }: PageProps) {
  const { t } = useI18n();
  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={t("sources")} description={t("sourcesDescription")} />
      <SourceHealth sources={data.sources.items} />
    </div>
  );
}
