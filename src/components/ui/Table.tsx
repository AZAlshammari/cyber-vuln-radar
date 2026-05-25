import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-surface-800">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-surface-800">{children}</table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap bg-slate-50 px-3 py-3 text-start text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-surface-900 dark:text-slate-400">{children}</th>;
}

export function Td({ children }: { children: ReactNode }) {
  return <td className="max-w-md px-3 py-3 align-top text-slate-700 dark:text-slate-200">{children}</td>;
}
