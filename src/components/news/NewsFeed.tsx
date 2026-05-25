import { ExternalLink } from "lucide-react";
import type { NewsItem } from "../../lib/types";
import { formatDate } from "../../lib/format";
import { localizeCategory, newsDisplaySummary, newsDisplayTitle } from "../../lib/localize";
import { useI18n } from "../../i18n";
import { Badge } from "../ui/Badge";

export function NewsFeed({ items }: { items: NewsItem[] }) {
  const { t, language } = useI18n();
  if (!items.length) return <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-surface-700">{t("noData")}</div>;
  return (
    <div className="grid gap-3 xl:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-850">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{localizeCategory(item.category, language)}</Badge>
            {item.breaking && <Badge tone="danger">{t("breaking")}</Badge>}
            {item.matchedVendors.length || item.matchedProducts.length ? <Badge tone="warning">{t("watchlistMatch")}</Badge> : null}
          </div>
          <h3 className="mt-3 text-base font-semibold leading-6 text-slate-950 dark:text-white">{newsDisplayTitle(item, language)}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{newsDisplaySummary(item, language)}</p>
          {language === "ar" ? (
            <details className="mt-3 rounded-md border border-slate-200 p-3 text-sm dark:border-surface-700">
              <summary className="cursor-pointer font-medium">{t("originalText")}</summary>
              <p className="mt-2 font-semibold" dir="ltr">{item.title}</p>
              <p className="mt-1 leading-6" dir="ltr">{item.summary}</p>
            </details>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{item.source}</span>
            <span>{formatDate(item.published, language)}</span>
            {item.relatedCves.map((cve) => <span key={cve} className="font-mono" dir="ltr">{cve}</span>)}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.slice(0, 5).map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <a className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 dark:text-cyan-200" href={item.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" /> {t("originalUrl")}
          </a>
        </article>
      ))}
    </div>
  );
}
