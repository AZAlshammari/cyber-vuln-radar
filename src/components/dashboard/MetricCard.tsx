import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function MetricCard({
  label,
  value,
  hint,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "danger" | "warning" | "success" | "info" | "neutral";
  icon?: ReactNode;
}) {
  return (
    <Card className="group min-h-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <div className="mt-2 text-3xl font-semibold tracking-normal">{value}</div>
        </div>
        {icon ? <Badge tone={tone}>{icon}</Badge> : null}
      </div>
      {hint ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </Card>
  );
}
