import type { PageProps } from "./types";
import { useI18n } from "../i18n";
import { PageHeader } from "../components/dashboard/PageHeader";
import { CveTable } from "../components/vulnerabilities/CveTable";
import { NewsFeed } from "../components/news/NewsFeed";

export function TopicPage({
  props,
  titleKey,
  descriptionKey,
  category,
  keywords,
}: {
  props: PageProps;
  titleKey: string;
  descriptionKey: string;
  category?: string;
  keywords: string[];
}) {
  const { t } = useI18n();
  const match = (text: string) => keywords.some((word) => text.toLowerCase().includes(word.toLowerCase()));
  const cves = props.data.cves.items.filter((item) => match(`${item.summary} ${item.tags.join(" ")} ${item.vendor} ${item.product}`));
  const news = props.data.news.items.filter((item) => item.category === category || match(`${item.title} ${item.summary} ${item.tags.join(" ")}`));
  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={t(titleKey)} description={t(descriptionKey)} />
      <h2 className="mb-3 text-lg font-semibold">{t("relatedCves")}</h2>
      <CveTable items={cves} />
      <h2 className="mb-3 mt-6 text-lg font-semibold">{t("relatedNews")}</h2>
      <NewsFeed items={news} />
    </div>
  );
}
