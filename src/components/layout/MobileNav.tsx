import { navItems } from "./navigation";
import { useI18n } from "../../i18n";
import { cx } from "../ui/utils";

export function MobileNav({ currentPath, navigate }: { currentPath: string; navigate: (path: string) => void }) {
  const { t } = useI18n();
  const items = navItems.slice(0, 5);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden dark:border-surface-800 dark:bg-surface-950">
      {items.map((item) => {
        const Icon = item.icon;
        const active = currentPath === item.path;
        return (
          <button
            key={item.path}
            className={cx("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]", active ? "text-cyan-600 dark:text-cyan-300" : "text-slate-500 dark:text-slate-400")}
            onClick={() => navigate(item.path)}
            aria-label={t(item.key)}
          >
            <Icon className="h-5 w-5" />
            <span className="max-w-full truncate px-1">{t(item.key)}</span>
          </button>
        );
      })}
    </nav>
  );
}
