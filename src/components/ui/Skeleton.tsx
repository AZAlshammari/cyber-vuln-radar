import { cx } from "./utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-md bg-slate-200 dark:bg-surface-800", className)} />;
}
