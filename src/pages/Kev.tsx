import type { PageProps } from "./types";
import { useI18n } from "../i18n";
import { PageHeader } from "../components/dashboard/PageHeader";
import { CveTable } from "../components/vulnerabilities/CveTable";

export function Kev({ data }: PageProps) {
  const { t } = useI18n();
  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={t("kev")} description={t("kevDescription")} />
      <CveTable items={data.cves.items.filter((item) => item.isKev)} />
    </div>
  );
}
