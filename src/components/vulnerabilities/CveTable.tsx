import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import type { CveItem, Language } from "../../lib/types";
import { formatDate, percent, severityTone } from "../../lib/format";
import { cveArabicTitle, cveDisplaySummary } from "../../lib/localize";
import { useI18n } from "../../i18n";
import { Table, Td, Th } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Pagination } from "../ui/Pagination";

export function CveTable({ items }: { items: CveItem[] }) {
  const { t, language } = useI18n();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CveItem | null>(null);
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const visible = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:hidden">
        {visible.map((item) => <CveCard key={item.id} item={item} onOpen={() => setSelected(item)} language={language} />)}
      </div>
      <div className="hidden lg:block">
        <Table>
          <thead>
            <tr>
              <Th>{t("cveId")}</Th>
              <Th>{t("summary")}</Th>
              <Th>{t("severity")}</Th>
              <Th>{t("cvssScore")}</Th>
              <Th>{t("epssPercentile")}</Th>
              <Th>{t("knownExploited")}</Th>
              <Th>{t("vendor")}</Th>
              <Th>{t("product")}</Th>
              <Th>{t("priorityScore")}</Th>
              <Th>{t("details")}</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-surface-800">
            {visible.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-surface-900">
                <Td><span className="font-mono" dir="ltr">{item.id}</span></Td>
                <Td><span className="line-clamp-2">{cveDisplaySummary(item, language)}</span></Td>
                <Td><Badge tone={severityTone(item.severity)}>{t(item.severity.toLowerCase())}</Badge></Td>
                <Td><span className="font-mono" dir="ltr">{item.cvssScore.toFixed(1)}</span></Td>
                <Td><span className="font-mono" dir="ltr">{percent(item.epssPercentile)}</span></Td>
                <Td>{item.isKev ? <Badge tone="danger">KEV</Badge> : <Badge>{t("unknown")}</Badge>}</Td>
                <Td>{item.vendor || t("unknown")}</Td>
                <Td>{item.product || t("unknown")}</Td>
                <Td><span className="font-mono" dir="ltr">{item.priorityScore.toFixed(2)}</span></Td>
                <Td><Button variant="ghost" onClick={() => setSelected(item)}>{t("open")}</Button></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      <Modal open={Boolean(selected)} title={selected?.id || t("details")} onClose={() => setSelected(null)}>
        {selected ? <CveDetail item={selected} /> : null}
      </Modal>
    </div>
  );
}

function CveCard({ item, onOpen, language }: { item: CveItem; onOpen: () => void; language: Language }) {
  const { t } = useI18n();
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-850">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-sm font-semibold" dir="ltr">{item.id}</div>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{language === "ar" ? cveArabicTitle(item) : item.id}</p>
          <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{cveDisplaySummary(item, language)}</p>
        </div>
        <Badge tone={severityTone(item.severity)}>{t(item.severity.toLowerCase())}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <span>{t("priorityScore")}: <b dir="ltr">{item.priorityScore.toFixed(2)}</b></span>
        <span>{t("epss")}: <b dir="ltr">{percent(item.epssPercentile)}</b></span>
        <span>{t("vendor")}: {item.vendor || t("unknown")}</span>
        <span>{formatDate(item.published, language)}</span>
      </div>
      <Button className="mt-3 w-full" variant="ghost" onClick={onOpen}>{t("details")}</Button>
    </article>
  );
}

function CveDetail({ item }: { item: CveItem }) {
  const { t, language } = useI18n();
  const breakdown = Object.entries(item.cvssBreakdown);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-4">
        <section>
          <h3 className="font-semibold">{t("fullDescription")}</h3>
          <p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">{cveDisplaySummary(item, language)}</p>
          {language === "ar" ? (
            <details className="mt-3 rounded-md border border-slate-200 p-3 text-sm dark:border-surface-700">
              <summary className="cursor-pointer font-medium">{t("originalText")}</summary>
              <p className="mt-2 leading-6" dir="ltr">{item.summary}</p>
            </details>
          ) : null}
        </section>
        <section>
          <h3 className="font-semibold">{t("triageNote")}</h3>
          <p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">
            {language === "ar"
              ? "الأولوية محسوبة محلياً من CVSS وEPSS وKEV وحداثة النشر ومؤشرات الاستغلال. راجع التعرض الفعلي، حالة التحديث، والضوابط التعويضية قبل إغلاق المعالجة."
              : "Prioritize validation because this CVE is scored from CVSS, EPSS, KEV, recency, and exploit indicators. Confirm exposure, patch status, and compensating controls."}
          </p>
        </section>
        <section>
          <h3 className="font-semibold">{t("cvssBreakdown")}</h3>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            {breakdown.map(([key, value]) => (
              <div key={key} className="rounded-md bg-slate-50 p-3 dark:bg-surface-800">
                <dt className="text-xs text-slate-500">{t(`cvss.${key}`)}</dt>
                <dd className="mt-1 font-medium">{value || t("unknown")}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h3 className="font-semibold">{t("references")}</h3>
          <div className="mt-2 grid gap-2">
            {item.references.slice(0, 8).map((url) => (
              <a key={url} className="flex items-center gap-2 break-all rounded-md border border-slate-200 p-2 text-sm text-cyan-700 dark:border-surface-700 dark:text-cyan-200" href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 shrink-0" /> <span dir="ltr">{url}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
      <aside className="space-y-3">
        {[
          [t("severity"), t(item.severity.toLowerCase())],
          [t("cvssScore"), item.cvssScore.toFixed(1)],
          [t("cvssVector"), item.cvssVector || t("unknown")],
          [t("epssScore"), item.epssScore.toFixed(4)],
          [t("epssPercentile"), percent(item.epssPercentile)],
          [t("priorityScore"), item.priorityScore.toFixed(2)],
          [t("published"), formatDate(item.published, language)],
          [t("lastModified"), formatDate(item.lastModified, language)],
          [t("vendor"), item.vendor || t("unknown")],
          [t("product"), item.product || t("unknown")],
          [t("knownRansomwareUse"), item.knownRansomwareUse ? t("knownExploited") : t("unknown")],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-200 p-3 dark:border-surface-700">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="mt-1 break-words font-medium" dir={String(value).startsWith("CVSS") ? "ltr" : undefined}>{value}</div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          {item.isKev && <Badge tone="danger">KEV</Badge>}
          {item.exploitAvailable && <Badge tone="warning">{t("exploitAvailable")}</Badge>}
          {item.patchAvailable && <Badge tone="success">{t("patchAvailable")}</Badge>}
          {item.workaroundAvailable && <Badge tone="info">{t("workaroundAvailable")}</Badge>}
        </div>
      </aside>
    </div>
  );
}
