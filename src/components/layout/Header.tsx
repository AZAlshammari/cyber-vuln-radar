import { Menu, Moon, Search, Sun, Languages, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { useI18n } from "../../i18n";
import { formatRelative } from "../../lib/format";
import type { Language, MetaData, Theme } from "../../lib/types";

export function Header({
  meta,
  theme,
  setTheme,
  setLanguage,
  search,
  setSearch,
  onMenu,
  onRefresh,
  refreshing,
}: {
  meta?: MetaData;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  search: string;
  setSearch: (value: string) => void;
  onMenu: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const { language, t } = useI18n();
  const healthTone = meta?.status === "ok" ? "success" : meta?.status === "partial" ? "warning" : "danger";
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur dark:border-surface-800 dark:bg-surface-950/90">
      <div className="flex min-h-16 items-center gap-3 px-3 lg:px-5">
        <Button className="lg:hidden" variant="ghost" onClick={onMenu} aria-label={t("menu")}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1 sm:flex-none sm:basis-56 xl:basis-72">
          <div className="truncate text-sm font-semibold text-slate-950 dark:text-white">{t("productName")}</div>
          <div className="hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">{t("tagline")}</div>
        </div>
        <div className="hidden min-w-56 flex-1 items-center gap-2 md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
            <Input
              id="global-search"
              className="ltr:pl-9 rtl:pr-9"
              value={search}
              placeholder={t("globalSearch")}
              aria-label={t("globalSearch")}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="hidden items-center gap-2 xl:flex">
          <Badge tone={healthTone}>{t("sourceHealth")}: {meta ? t(meta.status) : t("unknown")}</Badge>
          <Badge tone={(meta?.freshnessScore || 0) > 70 ? "success" : "warning"}>
            {t("lastUpdated")}: {formatRelative(meta?.generatedAt, language)}
          </Badge>
        </div>
        <Button variant="ghost" aria-label={t("selectLanguage")} onClick={() => setLanguage(language === "ar" ? "en" : "ar")}>
          <Languages className="h-5 w-5" />
          <span className="hidden sm:inline">{language === "ar" ? "EN" : "AR"}</span>
        </Button>
        <Button variant="ghost" aria-label={t("refreshData")} onClick={onRefresh} disabled={refreshing} title={t("manualUpdateHint")}>
          <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{refreshing ? t("refreshing") : t("refreshData")}</span>
        </Button>
        <Button
          variant="ghost"
          aria-label={t("toggleTheme")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <div className="border-t border-slate-200 p-3 md:hidden dark:border-surface-800">
        <Input value={search} placeholder={t("globalSearch")} aria-label={t("globalSearch")} onChange={(event) => setSearch(event.target.value)} />
      </div>
    </header>
  );
}
