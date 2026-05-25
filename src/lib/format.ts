import type { Language, Severity } from "./types";

export function formatDate(value?: string | null, language: Language = "en") {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatRelative(value?: string | null, language: Language = "en") {
  if (!value) return language === "ar" ? "غير معروف" : "Unknown";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return language === "ar" ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return language === "ar" ? `منذ ${hours} ساعة` : `${hours}h ago`;
  const days = Math.round(hours / 24);
  return language === "ar" ? `منذ ${days} يوم` : `${days}d ago`;
}

export function severityTone(severity: Severity | string) {
  switch (severity) {
    case "Critical":
      return "danger";
    case "High":
      return "warning";
    case "Medium":
      return "info";
    case "Low":
      return "success";
    default:
      return "neutral";
  }
}

export function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function numberCompact(value: number, language: Language) {
  return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US", {
    notation: "compact",
  }).format(value);
}
