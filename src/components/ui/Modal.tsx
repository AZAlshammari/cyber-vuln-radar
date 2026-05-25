import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-lg border border-slate-200 bg-white shadow-panel dark:border-surface-700 dark:bg-surface-900">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
