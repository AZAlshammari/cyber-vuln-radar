import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

export const highRiskTerms = [
  "zero-day", "0-day", "actively exploited", "exploited in the wild", "ransomware", "rce",
  "remote code execution", "authentication bypass", "privilege escalation", "command injection",
  "sql injection", "deserialization", "unauthenticated", "wormable", "public exploit", "poc",
];

export const vendors = [
  "Microsoft", "Apple", "Google", "Cisco", "Fortinet", "Palo Alto Networks", "VMware", "Citrix",
  "Ivanti", "Atlassian", "Adobe", "Oracle", "SAP", "Juniper", "F5", "SonicWall", "Linux",
  "Apache", "OpenSSL", "GitLab", "GitHub", "WordPress", "Chrome", "Android",
];

export const products = [
  "Windows", "Exchange", "SharePoint", "Chrome", "Android", "iOS", "FortiOS", "GlobalProtect",
  "vCenter", "Confluence", "Jira", "WordPress", "OpenSSL", "Apache", "Nginx", "Kubernetes", "Docker",
];

export const categoryRules = {
  "Zero-Day": ["zero-day", "0-day", "exploited in the wild", "actively exploited", "emergency patch"],
  Ransomware: ["ransomware", "extortion", "encryptor", "leak site", "double extortion"],
  "Data Breaches": ["breach", "leaked", "exposed", "stolen data", "data theft"],
  "Cloud Security": ["aws", "azure", "gcp", "cloud", "kubernetes", "container", "docker", "iam"],
  "AI Security": ["ai", "llm", "prompt injection", "model", "copilot", "generative ai", "machine learning"],
  "Supply Chain": ["supply chain", "dependency", "package", "npm", "pypi", "github actions", "ci/cd", "build pipeline"],
  Malware: ["malware", "trojan", "backdoor", "spyware", "botnet", "loader"],
  Phishing: ["phishing", "credential theft", "fake login", "scam"],
  Vulnerabilities: ["vulnerability", "cve", "patch", "flaw", "exploit", "bug"],
  "Government Advisories": ["cisa", "fbi", "nsa", "advisory", "alert"],
  "Threat Intelligence": ["apt", "threat actor", "campaign", "nation-state", "espionage"],
  "Tools & Research": ["tool", "research", "proof-of-concept", "poc", "github", "scanner"],
};

export const cweMap = {
  "CWE-79": ["Cross-site Scripting", "Improper neutralization of input during web page generation."],
  "CWE-89": ["SQL Injection", "Improper neutralization of special elements used in SQL commands."],
  "CWE-78": ["OS Command Injection", "Improper neutralization of special elements used in OS commands."],
  "CWE-22": ["Path Traversal", "Improper limitation of a pathname to a restricted directory."],
  "CWE-287": ["Improper Authentication", "Authentication is missing or can be bypassed."],
  "CWE-269": ["Improper Privilege Management", "Privileges are assigned, modified, or checked incorrectly."],
  "CWE-352": ["Cross-Site Request Forgery", "A web request may execute without user intent."],
  "CWE-416": ["Use After Free", "A program uses memory after it has been freed."],
  "CWE-787": ["Out-of-bounds Write", "Writes data past the intended buffer boundary."],
  "CWE-502": ["Deserialization of Untrusted Data", "Untrusted serialized data can alter control flow or objects."],
};

export function sourceRecord(source, status, itemCount = 0, error = null) {
  const now = new Date().toISOString();
  return {
    name: source.name,
    type: source.type,
    url: source.url,
    status,
    lastFetchedAt: now,
    lastSuccessfulFetchAt: status === "failed" ? null : now,
    itemCount,
    error,
    healthScore: status === "ok" ? 100 : status === "partial" ? 55 : 0,
  };
}

export async function fetchJson(source, { timeout = 20000, headers = {} } = {}) {
  const response = await fetchWithRetry(source.url, { timeout, headers });
  if (!response.ok) throw new Error(`${source.name} HTTP ${response.status}`);
  return response.json();
}

export async function fetchText(source, { timeout = 20000 } = {}) {
  const response = await fetchWithRetry(source.url, { timeout });
  if (!response.ok) throw new Error(`${source.name} HTTP ${response.status}`);
  return response.text();
}

export async function fetchWithRetry(url, init = {}, attempts = 2) {
  let lastError;
  for (let attempt = 0; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, init);
      if (response.ok || response.status < 500) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 1200 * (attempt + 1)));
  }
  throw lastError;
}

export async function fetchWithTimeout(url, { timeout = 20000, ...init } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: controller.signal, headers: { "user-agent": "rasd-cybersecurity-platform/1.0", ...(init.headers || {}) } });
  } finally {
    clearTimeout(timer);
  }
}

export function sanitizeText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalizeUrl(value = "") {
  try {
    const url = new URL(value);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach((key) => url.searchParams.delete(key));
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.trim();
  }
}

export function normalizeTitle(value = "") {
  return sanitizeText(value).toLowerCase().replace(/[!?.,:;]+/g, " ").replace(/\s+/g, " ").replace(/\s+-\s+(the hacker news|bleepingcomputer|securityweek|dark reading)$/i, "").trim();
}

export function hash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function categorize(text) {
  const lower = text.toLowerCase();
  for (const [category, words] of Object.entries(categoryRules)) {
    if (words.some((word) => lower.includes(word))) return category;
  }
  return "General Cybersecurity";
}

export function detectTerms(text, dictionary) {
  const lower = text.toLowerCase();
  return dictionary.filter((term) => lower.includes(term.toLowerCase()));
}

export function extractCves(text) {
  return Array.from(new Set((String(text).match(/CVE-\d{4}-\d{4,8}/gi) || []).map((x) => x.toUpperCase())));
}

export function parseCvssVector(vector) {
  const labels = {
    AV: { N: "Network", A: "Adjacent", L: "Local", P: "Physical" },
    AC: { L: "Low", H: "High" },
    PR: { N: "None", L: "Low", H: "High" },
    UI: { N: "None", R: "Required" },
    S: { U: "Unchanged", C: "Changed" },
    C: { H: "High", L: "Low", N: "None" },
    I: { H: "High", L: "Low", N: "None" },
    A: { H: "High", L: "Low", N: "None" },
  };
  const out = { attackVector: null, attackComplexity: null, privilegesRequired: null, userInteraction: null, scope: null, confidentiality: null, integrity: null, availability: null };
  if (!vector) return out;
  const map = Object.fromEntries(vector.split("/").map((part) => part.split(":")).filter((pair) => pair.length === 2));
  out.attackVector = labels.AV?.[map.AV] || null;
  out.attackComplexity = labels.AC?.[map.AC] || null;
  out.privilegesRequired = labels.PR?.[map.PR] || null;
  out.userInteraction = labels.UI?.[map.UI] || null;
  out.scope = labels.S?.[map.S] || null;
  out.confidentiality = labels.C?.[map.C] || null;
  out.integrity = labels.I?.[map.I] || null;
  out.availability = labels.A?.[map.A] || null;
  return out;
}

export function priorityScore({ cvssScore = 0, epssPercentile = 0, isKev = false, published, summary = "" }) {
  const kevBonus = isKev ? 2 : 0;
  const recencyBonus = published && Date.now() - new Date(published).getTime() <= 48 * 60 * 60 * 1000 ? 1 : 0;
  const keywordBonus = highRiskTerms.some((term) => summary.toLowerCase().includes(term)) ? 1 : 0;
  return Math.round((cvssScore * 0.35 + epssPercentile * 10 * 0.35 + kevBonus + recencyBonus + keywordBonus) * 100) / 100;
}

export function mapCwe(id) {
  const hit = cweMap[id];
  return { id, name: hit?.[0] || id, description: hit?.[1] || "CWE mapping from source data." };
}

export function inferFlags(text, references = []) {
  const lower = `${text} ${references.join(" ")}`.toLowerCase();
  const has = (terms) => terms.some((term) => lower.includes(term));
  return {
    exploitAvailable: has(["exploit", "poc", "proof-of-concept", "public exploit", "weaponized", "exploit-db", "metasploit", "packetstormsecurity"]),
    patchAvailable: has(["patch", "fixed", "update", "security update", "advisory", "release notes", "hotfix"]),
    workaroundAvailable: has(["workaround", "mitigation", "temporary fix", "configuration change", "disable", "block", "restrict"]),
  };
}

export function isoDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export async function writeJson(path, data) {
  await mkdir(new URL(".", path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}
