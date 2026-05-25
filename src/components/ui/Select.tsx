import type { SelectHTMLAttributes } from "react";
import { cx } from "./utils";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        "min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 dark:border-surface-700 dark:bg-surface-900 dark:text-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
