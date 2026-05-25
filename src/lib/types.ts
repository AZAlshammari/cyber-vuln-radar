export type Language = "ar" | "en";
export type Theme = "dark" | "light" | "system";
export type Severity = "Critical" | "High" | "Medium" | "Low" | "Unknown";
export type SourceStatus = "ok" | "failed" | "partial";

export interface CweInfo {
  id: string;
  name: string;
  description: string;
}

export interface CvssBreakdown {
  attackVector: string | null;
  attackComplexity: string | null;
  privilegesRequired: string | null;
  userInteraction: string | null;
  scope: string | null;
  confidentiality: string | null;
  integrity: string | null;
  availability: string | null;
}

export interface KevItem {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  dueDate: string;
  requiredAction: string;
  knownRansomwareCampaignUse: string;
  notes: string;
}

export interface CveItem {
  id: string;
  summary: string;
  published: string;
  lastModified: string;
  severity: Severity;
  cvssScore: number;
  cvssVector: string | null;
  cvssBreakdown: CvssBreakdown;
  epssScore: number;
  epssPercentile: number;
  isKev: boolean;
  kev: Omit<KevItem, "cveID"> | null;
  vendor: string | null;
  product: string | null;
  cwe: CweInfo[];
  references: string[];
  vendorAdvisoryLinks: string[];
  exploitAvailable: boolean;
  patchAvailable: boolean;
  workaroundAvailable: boolean;
  recentlyPublished: boolean;
  recentlyModified: boolean;
  knownRansomwareUse: boolean;
  priorityScore: number;
  tags: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  published: string;
  url: string;
  canonicalUrl: string;
  tags: string[];
  breaking: boolean;
  duplicateGroupId: string | null;
  relatedCves: string[];
  matchedVendors: string[];
  matchedProducts: string[];
}

export interface TrendCount {
  [key: string]: string | number;
  count: number;
}

export interface TimelinePoint {
  date: string;
  cves: number;
  news: number;
  kev: number;
}

export interface VendorSeverityHeatmap {
  vendor: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unknown: number;
}

export interface TrendsData {
  generatedAt: string;
  topKeywords: { keyword: string; count: number }[];
  topVendors: { vendor: string; count: number }[];
  topProducts: { product: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  severityDistribution: { severity: string; count: number }[];
  sourceDistribution: { source: string; count: number }[];
  epssBuckets: { bucket: string; count: number }[];
  timeline: TimelinePoint[];
  vendorSeverityHeatmap: VendorSeverityHeatmap[];
}

export interface SourceItem {
  name: string;
  type: "rss" | "api" | "json";
  url: string;
  status: SourceStatus;
  lastFetchedAt: string;
  lastSuccessfulFetchAt: string | null;
  itemCount: number;
  error: string | null;
  healthScore: number;
}

export interface MetaData {
  generatedAt: string;
  lastSuccessfulUpdate: string;
  status: SourceStatus;
  freshnessScore: number;
  summary: {
    cveCount: number;
    kevCount: number;
    newsCount: number;
    sourceCount: number;
    failedSourceCount: number;
    criticalCount: number;
    highCount: number;
    highEpssCount: number;
    exploitAvailableCount: number;
    patchAvailableCount: number;
  };
  errors: string[];
}

export interface DataEnvelope<T> {
  generatedAt: string;
  count: number;
  items: T[];
}

export interface AppData {
  cves: DataEnvelope<CveItem>;
  kev: DataEnvelope<KevItem>;
  news: DataEnvelope<NewsItem>;
  trends: TrendsData;
  sources: { generatedAt: string; items: SourceItem[] };
  meta: MetaData;
}

export interface Watchlists {
  vendors: string[];
  products: string[];
  keywords: string[];
}

export interface FilterState {
  search: string;
  severity: string;
  category: string;
  source: string;
  vendor: string;
  product: string;
  cwe: string;
  tags: string;
  kevOnly: boolean;
  exploitAvailable: boolean;
  patchAvailable: boolean;
  workaroundAvailable: boolean;
  recentlyPublished: boolean;
  recentlyModified: boolean;
  breakingOnly: boolean;
  watchlistOnly: boolean;
  minCvss: number;
  minEpss: number;
  timeRange: "24h" | "7d" | "14d" | "30d";
  sort: string;
}

export interface DashboardCardPreference {
  id: string;
  visible: boolean;
  order: number;
}
