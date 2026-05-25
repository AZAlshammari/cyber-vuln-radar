import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">{title}</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
