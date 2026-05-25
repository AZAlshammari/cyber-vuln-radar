import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <section
      className={cx(
        "card-depth rounded-lg border border-slate-200 bg-white/92 p-4 shadow-sm backdrop-blur dark:border-surface-800 dark:bg-surface-850/92",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardTitle({ className, children }: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return <h3 className={cx("text-sm font-semibold text-slate-900 dark:text-slate-100", className)}>{children}</h3>;
}
