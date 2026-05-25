import type { ReactNode } from "react";

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full z-40 mb-2 hidden rounded-md bg-slate-950 px-2 py-1 text-xs text-white group-hover:block ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2">
        {label}
      </span>
    </span>
  );
}
