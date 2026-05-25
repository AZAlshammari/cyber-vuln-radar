import type { ReactNode } from "react";
import { cx } from "./utils";

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-surface-700 dark:bg-surface-900">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={cx(
            "min-h-9 rounded-md px-3 text-sm font-medium",
            value === tab.value ? "bg-white text-cyan-700 shadow-sm dark:bg-surface-800 dark:text-cyan-200" : "text-slate-600 dark:text-slate-300",
          )}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
