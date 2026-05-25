import { useState, type ReactNode } from "react";
import { AlertTriangle, Bug, Clock, Newspaper, RadioTower, ShieldAlert, TrendingUp, Wrench, Zap } from "lucide-react";
import type { PageProps } from "./types";
import { useI18n } from "../i18n";
import { MetricCard } from "../components/dashboard/MetricCard";
import { PageHeader } from "../components/dashboard/PageHeader";
import { Card, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { formatRelative, numberCompact } from "../lib/format";
import { CveTable } from "../components/vulnerabilities/CveTable";
import { NewsFeed } from "../components/news/NewsFeed";
import { localizeKeyword } from "../lib/localize";

export function Dashboard({ data, dashboardCards, navigate, language }: PageProps) {
  const { t } = useI18n();
  const [now] = useState(() => Date.now());
  const cards = [...dashboardCards].filter((c) => c.visible).sort((a, b) => a.order - b.order);
  const byId: Record<string, ReactNode> = {
    critical: <MetricCard label={t("criticalVulnerabilities")} value={data.meta.summary.criticalCount} tone="danger" icon={<Bug className="h-4 w-4" />} hint={t("highRisk")} />,
    kev: <MetricCard label={t("knownExploited")} value={data.meta.summary.kevCount} tone="danger" icon={<ShieldAlert className="h-4 w-4" />} hint={t("kevDescription")} />,
    epss: <MetricCard label={t("highEpss")} value={data.meta.summary.highEpssCount} tone="warning" icon={<TrendingUp className="h-4 w-4" />} />,
    exploit: <MetricCard label={t("exploitAvailable")} value={data.meta.summary.exploitAvailableCount} tone="warning" icon={<Zap className="h-4 w-4" />} />,
    patch: <MetricCard label={t("patchAvailable")} value={data.meta.summary.patchAvailableCount} tone="success" icon={<Wrench className="h-4 w-4" />} />,
    news: <MetricCard label={t("latestNews")} value={data.meta.summary.newsCount} tone="info" icon={<Newspaper className="h-4 w-4" />} />,
    trend: <MetricCard label={t("trendingTopic")} value={localizeKeyword(data.trends.topKeywords[0]?.keyword || t("unknown"), language)} tone="info" icon={<TrendingUp className="h-4 w-4" />} />,
    sources: <MetricCard label={t("sourceHealth")} value={`${Math.round((data.sources.items.filter((s) => s.status === "ok").length / Math.max(1, data.sources.items.length)) * 100)}%`} tone="success" icon={<RadioTower className="h-4 w-4" />} />,
    freshness: <MetricCard label={t("dataFreshness")} value={`${data.meta.freshnessScore}%`} tone={data.meta.freshnessScore > 70 ? "success" : "warning"} icon={<Clock className="h-4 w-4" />} hint={formatRelative(data.meta.generatedAt, language)} />,
  };
  const highPriority = data.cves.items.slice().sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 8);
  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={t("dashboard")} description={t("dashboardDescription")} actions={<Button onClick={() => navigate("/settings")}>{t("dashboardCustomization")}</Button>} />
      {now - new Date(data.meta.generatedAt).getTime() > 30 * 60 * 1000 ? (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4" /> {t("staleWarning")}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card) => <div key={card.id}>{byId[card.id]}</div>)}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <CardTitle>{t("highPriorityCves")}</CardTitle>
            <Button variant="ghost" onClick={() => navigate("/vulnerabilities")}>{t("viewAll")}</Button>
          </div>
          <CveTable items={highPriority} />
        </Card>
        <div className="space-y-5">
          <Card>
            <CardTitle>{t("topVendors")}</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">{data.trends.topVendors.slice(0, 12).map((v) => <Badge key={v.vendor}>{v.vendor} <span className="ms-1 font-mono">{numberCompact(v.count, language)}</span></Badge>)}</div>
          </Card>
          <Card>
            <CardTitle>{t("topKeywords")}</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">{data.trends.topKeywords.slice(0, 18).map((k) => <Badge key={k.keyword} tone="info">{localizeKeyword(k.keyword, language)}</Badge>)}</div>
          </Card>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("latestNews")}</h2>
          <Button variant="ghost" onClick={() => navigate("/news")}>{t("viewAll")}</Button>
        </div>
        <NewsFeed items={data.news.items.slice(0, 6)} />
      </div>
    </div>
  );
}
