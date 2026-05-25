import type { PageProps } from "./types";
import { useI18n } from "../i18n";
import { PageHeader } from "../components/dashboard/PageHeader";
import { Charts } from "../components/trends/Charts";

export function Trends({ data }: PageProps) {
  const { t } = useI18n();
  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={t("trends")} description={t("trendsDescription")} />
      <Charts trends={data.trends} />
    </div>
  );
}
