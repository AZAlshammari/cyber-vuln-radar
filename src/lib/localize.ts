import type { CveItem, Language, NewsItem } from "./types";
import { formatDate, percent } from "./format";

const termMap: Record<string, string> = {
  exploit: "استغلال",
  version: "إصدار",
  vulnerability: "ثغرة",
  vulnerabilities: "ثغرات",
  ransomware: "برمجيات الفدية",
  "zero-day": "يوم الصفر",
  "supply-chain": "سلسلة التوريد",
  supply: "توريد",
  chain: "سلسلة التوريد",
  cloud: "السحابة",
  authentication: "المصادقة",
  bypass: "تجاوز",
  privilege: "الصلاحيات",
  escalation: "تصعيد",
  remote: "عن بعد",
  code: "تنفيذ شيفرة",
  execution: "تنفيذ",
  patch: "تحديث أمني",
  malware: "برمجيات خبيثة",
  phishing: "تصيد",
  breach: "تسريب بيانات",
  exposed: "مكشوف",
  package: "حزمة",
  dependency: "اعتمادية",
  injection: "حقن",
  command: "أوامر",
  sql: "SQL",
  prompt: "Prompt",
  model: "نموذج",
  advisory: "تنبيه أمني",
};

const severityAr: Record<string, string> = {
  Critical: "حرجة",
  High: "عالية",
  Medium: "متوسطة",
  Low: "منخفضة",
  Unknown: "غير معروفة",
};

const categoryAr: Record<string, string> = {
  Vulnerabilities: "الثغرات",
  "Exploited in the Wild": "الاستغلال الميداني",
  Ransomware: "برمجيات الفدية",
  "Data Breaches": "تسريبات البيانات",
  "Cloud Security": "أمن السحابة",
  "AI Security": "أمن الذكاء الاصطناعي",
  "Supply Chain": "سلسلة التوريد",
  Malware: "البرمجيات الخبيثة",
  Phishing: "التصيد",
  "Zero-Day": "يوم الصفر",
  "Threat Intelligence": "استخبارات التهديدات",
  "Government Advisories": "التنبيهات الحكومية",
  "Tools & Research": "الأدوات والأبحاث",
  "General Cybersecurity": "الأمن السيبراني العام",
};

export function localizeKeyword(value: string, language: Language) {
  if (language !== "ar") return value;
  return termMap[value.toLowerCase()] || value;
}

export function localizeCategory(value: string, language: Language) {
  if (language !== "ar") return value;
  return categoryAr[value] || value;
}

export function cveArabicTitle(cve: CveItem) {
  const target = [cve.vendor, cve.product].filter(Boolean).join(" / ") || "منتج غير محدد";
  return `ثغرة ${severityAr[cve.severity] || "غير معروفة"} في ${target}`;
}

export function cveDisplaySummary(cve: CveItem, language: Language) {
  if (language !== "ar") return cve.summary;
  const signals = [];
  if (cve.isKev) signals.push("مدرجة ضمن KEV");
  if (cve.epssPercentile >= 0.9) signals.push(`نسبة EPSS مرتفعة ${percent(cve.epssPercentile)}`);
  if (cve.exploitAvailable) signals.push("توجد مؤشرات على توفر استغلال");
  if (cve.patchAvailable) signals.push("يوجد تحديث أو تنبيه أمني");
  if (cve.workaroundAvailable) signals.push("يوجد حل مؤقت أو تخفيف");
  if (cve.knownRansomwareUse) signals.push("مرتبطة باستخدام معروف في برمجيات الفدية");
  const cwe = cve.cwe[0]?.id ? ` وتصنيف ${cve.cwe[0].id}` : "";
  return `${cveArabicTitle(cve)} بدرجة CVSS ${cve.cvssScore.toFixed(1)}${cwe}. ${signals.length ? signals.join("، ") : "تحتاج إلى تقييم حسب التعرض الداخلي"}.`;
}

export function newsDisplayTitle(item: NewsItem, language: Language) {
  if (language !== "ar") return item.title;
  const topic = localizeCategory(item.category, "ar");
  const target = [...item.matchedVendors, ...item.matchedProducts, ...item.relatedCves].slice(0, 3).join(" / ");
  return target ? `خبر ${topic}: ${target}` : `خبر ${topic}`;
}

export function newsDisplaySummary(item: NewsItem, language: Language) {
  if (language !== "ar") return item.summary;
  const related = item.relatedCves.length ? `يرتبط بـ ${item.relatedCves.join(" و ")}. ` : "";
  const targets = [...item.matchedVendors, ...item.matchedProducts].length
    ? `العناصر المتأثرة أو المذكورة: ${[...item.matchedVendors, ...item.matchedProducts].join(" / ")}. `
    : "";
  const breaking = item.breaking ? "مصنف كخبر عاجل عالي المخاطر. " : "";
  return `${breaking}${related}${targets}المصدر: ${item.source}. تاريخ النشر: ${formatDate(item.published, "ar")}. النص الأصلي متاح من الرابط الخارجي.`;
}
