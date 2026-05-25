import type { AppData, DashboardCardPreference, FilterState, Language, Theme, Watchlists } from "../lib/types";

export interface PageProps {
  data: AppData;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  watchlists: Watchlists;
  setWatchlists: (watchlists: Watchlists) => void;
  dashboardCards: DashboardCardPreference[];
  setDashboardCards: (cards: DashboardCardPreference[]) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  navigate: (path: string) => void;
  path: string;
}
