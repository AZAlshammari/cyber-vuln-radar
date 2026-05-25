import type { ReactNode } from "react";

export function Dropdown({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <details className="relative">
      <summary className="list-none">{label}</summary>
      <div className="absolute z-30 mt-2 min-w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-panel ltr:right-0 rtl:left-0 dark:border-surface-700 dark:bg-surface-900">
        {children}
      </div>
    </details>
  );
}
