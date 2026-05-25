import { useCallback, useEffect, useMemo, useState } from "react";
import { I18nContext, translate, useI18n } from "./i18n";
import { AppShell } from "./components/layout/AppShell";
import { Skeleton } from "./components/ui/Skeleton";
import { Button } from "./components/ui/Button";
import { loadAppData } from "./lib/data";
import type { AppData, FilterState, Language, Theme } from "./lib/types";
import {
  defaultDashboardCards,
  defaultFilters,
  defaultWatchlists,
  getInitialLanguage,
  getInitialTheme,
  readStorage,
  writeStorage,
} from "./lib/storage";
import { readFiltersFromUrl, writeFiltersToUrl } from "./lib/urlState";
import { Dashboard } from "./pages/Dashboard";
import { Vulnerabilities } from "./pages/Vulnerabilities";
import { News } from "./pages/News";
import { Trends } from "./pages/Trends";
import { Sources } from "./pages/Sources";
import { Kev } from "./pages/Kev";
import { ZeroDay } from "./pages/ZeroDay";
import { Ransomware } from "./pages/Ransomware";
import { CloudSecurity } from "./pages/CloudSecurity";
import { AiSecurity } from "./pages/AiSecurity";
import { SupplyChain } from "./pages/SupplyChain";
import { Settings } from "./pages/Settings";
import { ProfilePage } from "./pages/ProfilePage";
import type { PageProps } from "./pages/types";

function routeFromHash() {
  const raw = location.hash.replace(/^#/, "") || "/dashboard";
  return raw.split("?")[0] || "/dashboard";
}

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [path, setPath] = useState(routeFromHash);
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage());
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [filters, setFiltersState] = useState<FilterState>(() => ({
    ...readStorage("filters", defaultFilters),
    ...readFiltersFromUrl(),
  }));
  const [watchlists, setWatchlistsState] = useState(() => readStorage("watchlists", defaultWatchlists));
  const [dashboardCards, setDashboardCardsState] = useState(() => readStorage("dashboardCards", defaultDashboardCards));

  const t = useCallback((key: string, params?: Record<string, string | number>) => translate(language, key, params), [language]);
  const context = useMemo(() => ({ language, setLanguage: setLanguageState, t }), [language, t]);

  const navigate = useCallback((nextPath: string) => {
    location.hash = nextPath;
    setPath(nextPath);
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    writeStorage("language", next);
  };

  const setTheme = (next: Theme) => {
    setThemeState(next);
    writeStorage("theme", next);
  };

  const setFilters = (next: FilterState) => {
    setFiltersState(next);
    writeStorage("filters", next);
    writeFiltersToUrl(path, next);
  };

  const setWatchlists = (next: typeof watchlists) => {
    setWatchlistsState(next);
    writeStorage("watchlists", next);
  };

  const setDashboardCards = (next: typeof dashboardCards) => {
    setDashboardCardsState(next);
    writeStorage("dashboardCards", next);
  };

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      setError(null);
      setData(await loadAppData(String(Date.now())));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadAppData(String(Date.now()))
      .then((next) => {
        if (active) setData(next);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onHash = () => setPath(routeFromHash());
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = t("productName");
  }, [language, t]);

  useEffect(() => {
    const effectiveTheme = theme === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : theme;
    document.documentElement.classList.toggle("dark", effectiveTheme === "dark");
  }, [theme]);

  useEffect(() => {
    let sequence = "";
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable) return;
      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("global-search")?.focus();
        return;
      }
      sequence = sequence ? `${sequence} ${event.key.toLowerCase()}` : event.key.toLowerCase();
      const routes: Record<string, string> = {
        "g d": "/dashboard",
        "g v": "/vulnerabilities",
        "g n": "/news",
        "g t": "/trends",
        "g s": "/sources",
      };
      if (routes[sequence]) {
        navigate(routes[sequence]);
        sequence = "";
      }
      window.setTimeout(() => (sequence = ""), 900);
    };
    addEventListener("keydown", onKeyDown);
    return () => removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  const setSearch = (value: string) => setFilters({ ...filters, search: value });
  const pageProps = data
    ? { data, filters, setFilters, watchlists, setWatchlists, dashboardCards, setDashboardCards, language, setLanguage, theme, setTheme, navigate, path }
    : null;

  return (
    <I18nContext.Provider value={context}>
      <AppShell
        currentPath={path}
        navigate={navigate}
        meta={data?.meta}
        theme={theme}
        setTheme={setTheme}
        setLanguage={setLanguage}
        search={filters.search}
        setSearch={setSearch}
        onRefresh={refreshData}
        refreshing={refreshing}
      >
        {error ? <ErrorView message={error} /> : !pageProps ? <LoadingView /> : <RenderPage path={path} props={pageProps} />}
      </AppShell>
    </I18nContext.Provider>
  );
}

function RenderPage({ path, props }: { path: string; props: PageProps }) {
  if (path.startsWith("/vendor/")) return <ProfilePage props={props} type="vendor" name={path.replace("/vendor/", "")} />;
  if (path.startsWith("/product/")) return <ProfilePage props={props} type="product" name={path.replace("/product/", "")} />;
  if (path.startsWith("/source/")) return <ProfilePage props={props} type="source" name={path.replace("/source/", "")} />;
  switch (path) {
    case "/vulnerabilities":
      return <Vulnerabilities {...props} />;
    case "/news":
      return <News {...props} />;
    case "/trends":
      return <Trends {...props} />;
    case "/sources":
      return <Sources {...props} />;
    case "/kev":
      return <Kev {...props} />;
    case "/zero-day":
      return <ZeroDay {...props} />;
    case "/ransomware":
      return <Ransomware {...props} />;
    case "/cloud-security":
      return <CloudSecurity {...props} />;
    case "/ai-security":
      return <AiSecurity {...props} />;
    case "/supply-chain":
      return <SupplyChain {...props} />;
    case "/settings":
      return <Settings {...props} />;
    default:
      return <Dashboard {...props} />;
  }
}

function LoadingView() {
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Skeleton className="h-20" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  const { t } = useI18n();
  return (
    <div className="p-4 lg:p-6">
      <div className="rounded-lg border border-red-300 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
        <h1 className="text-lg font-semibold">{t("error")}</h1>
        <p className="mt-2">{message}</p>
        <Button className="mt-4" onClick={() => location.reload()}>{t("reload")}</Button>
      </div>
    </div>
  );
}
