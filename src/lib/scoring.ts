import type { CveItem } from "./types";

export const highRiskTerms = [
  "zero-day",
  "0-day",
  "actively exploited",
  "exploited in the wild",
  "ransomware",
  "rce",
  "remote code execution",
  "authentication bypass",
  "privilege escalation",
  "command injection",
  "sql injection",
  "deserialization",
  "unauthenticated",
  "wormable",
  "public exploit",
  "poc",
];

export function calculatePriorityScore(input: {
  cvssScore?: number;
  epssPercentile?: number;
  isKev?: boolean;
  published?: string;
  summary?: string;
}) {
  const cvss = input.cvssScore || 0;
  const epss = input.epssPercentile || 0;
  const kevBonus = input.isKev ? 2 : 0;
  const publishedTime = input.published ? new Date(input.published).getTime() : 0;
  const recencyBonus = publishedTime && Date.now() - publishedTime <= 48 * 60 * 60 * 1000 ? 1 : 0;
  const text = (input.summary || "").toLowerCase();
  const keywordBonus = highRiskTerms.some((term) => text.includes(term)) ? 1 : 0;
  return Math.round((cvss * 0.35 + epss * 10 * 0.35 + kevBonus + recencyBonus + keywordBonus) * 100) / 100;
}

export function triageNote(cve: CveItem) {
  const reasons = [];
  if (cve.isKev) reasons.push("KEV");
  if (cve.epssPercentile >= 0.9) reasons.push("high EPSS");
  if (cve.exploitAvailable) reasons.push("exploit indicators");
  if (cve.patchAvailable) reasons.push("patch references");
  if (cve.knownRansomwareUse) reasons.push("ransomware linkage");
  const base = reasons.length ? reasons.join(", ") : "baseline CVSS and recency";
  return `Prioritize validation because this CVE is scored from ${base}. Confirm exposure, patch status, and compensating controls.`;
}
