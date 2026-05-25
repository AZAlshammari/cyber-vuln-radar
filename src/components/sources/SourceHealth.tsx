import type { SourceItem } from "../../lib/types";
import { formatDate } from "../../lib/format";
import { useI18n } from "../../i18n";
import { Badge } from "../ui/Badge";
import { Card, CardTitle } from "../ui/Card";
import { Table, Td, Th } from "../ui/Table";

export function SourceHealth({ sources }: { sources: SourceItem[] }) {
  const { t, language } = useI18n();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {sources.slice(0, 3).map((source) => (
          <Card key={source.name}>
            <CardTitle>{source.name}</CardTitle>
            <div className="mt-3 flex items-center justify-between">
              <Badge tone={source.status === "ok" ? "success" : source.status === "partial" ? "warning" : "danger"}>{t(source.status)}</Badge>
              <span className="font-mono text-lg">{source.healthScore}</span>
            </div>
          </Card>
        ))}
      </div>
      <Table>
        <thead>
          <tr>
            <Th>{t("source")}</Th>
            <Th>{t("type")}</Th>
            <Th>{t("status")}</Th>
            <Th>{t("lastFetched")}</Th>
            <Th>{t("lastSuccessfulFetch")}</Th>
            <Th>{t("itemCount")}</Th>
            <Th>{t("healthScore")}</Th>
            <Th>{t("errorMessage")}</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-surface-800">
          {sources.map((source) => (
            <tr key={`${source.name}-${source.url}`}>
              <Td><a className="font-medium text-cyan-700 dark:text-cyan-200" href={`#/source/${encodeURIComponent(source.name)}`}>{source.name}</a></Td>
              <Td>{source.type.toUpperCase()}</Td>
              <Td><Badge tone={source.status === "ok" ? "success" : source.status === "partial" ? "warning" : "danger"}>{t(source.status)}</Badge></Td>
              <Td>{formatDate(source.lastFetchedAt, language)}</Td>
              <Td>{formatDate(source.lastSuccessfulFetchAt, language)}</Td>
              <Td><span className="font-mono">{source.itemCount}</span></Td>
              <Td><span className="font-mono">{source.healthScore}</span></Td>
              <Td><span className="line-clamp-2">{source.error || t("unknown")}</span></Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
