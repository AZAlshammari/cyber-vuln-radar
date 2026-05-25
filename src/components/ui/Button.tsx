import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  className,
  variant = "secondary",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const variants = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-500 focus-visible:ring-cyan-400",
    secondary: "bg-surface-100 text-surface-900 hover:bg-white dark:bg-surface-800 dark:text-slate-100 dark:hover:bg-surface-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-surface-800",
    danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400",
  };
  return (
    <button
      className={cx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 dark:border-surface-700",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
