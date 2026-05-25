import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Drawer({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <aside className="h-full w-[min(86vw,22rem)] overflow-auto border-slate-200 bg-white p-4 shadow-panel ltr:border-r rtl:mr-auto rtl:border-l dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </aside>
    </div>
  );
}
