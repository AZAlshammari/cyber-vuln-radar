import type { PageProps } from "./types";
import { PageHeader } from "../components/dashboard/PageHeader";
import { CveTable } from "../components/vulnerabilities/CveTable";
import { NewsFeed } from "../components/news/NewsFeed";
import { SourceHealth } from "../components/sources/SourceHealth";
import { Charts } from "../components/trends/Charts";
import { useI18n } from "../i18n";

export function ProfilePage({ props, type, name }: { props: PageProps; type: "vendor" | "product" | "source"; name: string }) {
  const { t } = useI18n();
  const decoded = decodeURIComponent(name);
  if (type === "source") {
    return (
      <div className="p-4 lg:p-6">
        <PageHeader title={`${t("source")} ${t("profile")}: ${decoded}`} description={t("sourceReliability")} />
        <SourceHealth sources={props.data.sources.items.filter((source) => source.name === decoded)} />
        <h2 className="mb-3 mt-6 text-lg font-semibold">{t("latestNews")}</h2>
        <NewsFeed items={props.data.news.items.filter((item) => item.source === decoded)} />
      </div>
    );
  }
  const cves = props.data.cves.items.filter((item) => (type === "vendor" ? item.vendor === decoded : item.product === decoded));
  const news = props.data.news.items.filter((item) =>
    type === "vendor" ? item.matchedVendors.includes(decoded) || JSON.stringify(item).includes(decoded) : item.matchedProducts.includes(decoded) || JSON.stringify(item).includes(decoded),
  );
  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={`${t(type)} ${t("profile")}: ${decoded}`} description={type === "vendor" ? t("relatedProducts") : t("relatedCves")} />
      <h2 className="mb-3 text-lg font-semibold">{t("relatedCves")}</h2>
      <CveTable items={cves} />
      <h2 className="mb-3 mt-6 text-lg font-semibold">{t("relatedNews")}</h2>
      <NewsFeed items={news} />
      <h2 className="mb-3 mt-6 text-lg font-semibold">{t("trends")}</h2>
      <Charts trends={props.data.trends} />
    </div>
  );
}
