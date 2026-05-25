import { navItems } from "./navigation";
import { useI18n } from "../../i18n";
import { cx } from "../ui/utils";

export function Sidebar({ currentPath, navigate }: { currentPath: string; navigate: (path: string) => void }) {
  const { t } = useI18n();
  return (
    <nav className="space-y-1" aria-label="Main navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cx(
              "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500",
              active
                ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/55 dark:text-cyan-200"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-800",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{t(item.key)}</span>
          </button>
        );
      })}
    </nav>
  );
}
