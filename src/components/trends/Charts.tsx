import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendsData } from "../../lib/types";
import { useI18n } from "../../i18n";
import { Card, CardTitle } from "../ui/Card";
import { localizeCategory } from "../../lib/localize";

const colors = ["#06b6d4", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#64748b"];

export function Charts({ trends }: { trends: TrendsData }) {
  const { t, language } = useI18n();
  const severityData = trends.severityDistribution.map((item) => ({ ...item, label: t(item.severity.toLowerCase()) }));
  const categoryData = trends.categoryDistribution.map((item) => ({ ...item, label: localizeCategory(item.category, language) }));
  const bucketData = trends.epssBuckets.map((item) => ({
    ...item,
    label: item.bucket === "Very High" ? t("veryHighBucket") : item.bucket === "High" ? t("highBucket") : item.bucket === "Medium" ? t("mediumBucket") : t("lowBucket"),
  }));
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard title={t("severityDistribution")}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={severityData} dataKey="count" nameKey="label" outerRadius={90} label>
              {trends.severityDistribution.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title={t("categoryDistribution")}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryData.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title={t("cveTimeline")}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trends.timeline}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="cves" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.45} />
            <Area type="monotone" dataKey="news" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.45} />
            <Area type="monotone" dataKey="kev" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.45} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title={t("topSources")}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={trends.sourceDistribution.slice(0, 10)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="source" width={120} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title={t("epssBuckets")}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={bucketData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title={t("vendorHeatmap")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-start text-xs text-slate-500">
                <th className="p-2 text-start">{t("vendor")}</th>
                {["critical", "high", "medium", "low", "unknown"].map((s) => <th key={s} className="p-2 text-start">{t(s)}</th>)}
              </tr>
            </thead>
            <tbody>
              {trends.vendorSeverityHeatmap.slice(0, 8).map((row) => (
                <tr key={row.vendor} className="border-t border-slate-200 dark:border-surface-800">
                  <td className="p-2 font-medium">{row.vendor}</td>
                  {(["critical", "high", "medium", "low", "unknown"] as const).map((key) => (
                    <td key={key} className="p-2">
                      <span className="inline-flex min-w-8 justify-center rounded bg-cyan-500/10 px-2 py-1 font-mono">{row[key]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <div className="mt-4">{children}</div>
    </Card>
  );
}
