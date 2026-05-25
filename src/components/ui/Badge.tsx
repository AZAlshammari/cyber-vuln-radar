import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

type Tone = "danger" | "warning" | "success" | "info" | "neutral";

export function Badge({
  className,
  tone = "neutral",
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; children: ReactNode }) {
  const tones = {
    danger: "border-red-300 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-200",
    warning: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/50 dark:text-amber-200",
    success: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/50 dark:text-emerald-200",
    info: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-900/70 dark:bg-cyan-950/50 dark:text-cyan-200",
    neutral: "border-slate-300 bg-slate-50 text-slate-700 dark:border-surface-700 dark:bg-surface-800 dark:text-slate-200",
  };
  return (
    <span className={cx("inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium", tones[tone], className)} {...props}>
      {children}
    </span>
  );
}
