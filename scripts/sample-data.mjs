import { parseCvssVector } from "./utils.mjs";

const generatedAt = "2026-05-25T17:00:00.000Z";

export function sampleSnapshot() {
  const kev = [
    kevItem("CVE-2026-10001", "Microsoft", "Windows", "Gateway Command Injection", "Known"),
    kevItem("CVE-2026-10002", "Ivanti", "GlobalProtect", "Authentication Bypass", "Unknown"),
    kevItem("CVE-2026-10005", "GitHub", "GitHub Actions", "CI/CD Secret Exposure", "Unknown"),
  ];
  const cves = [
    cve("CVE-2026-10001", "Remote code execution vulnerability in a gateway allows unauthenticated command execution. Public exploit and ransomware indicators are being monitored.", "Critical", 9.8, 0.97, "Microsoft", "Windows", "CWE-78", true, true),
    cve("CVE-2026-10002", "Authentication bypass in edge appliance may allow administrative access. Emergency patches and mitigations are available.", "Critical", 9.1, 0.91, "Ivanti", "GlobalProtect", "CWE-287", true, false),
    cve("CVE-2026-10003", "Privilege escalation flaw in Kubernetes node component could allow elevated privileges after container escape.", "High", 8.4, 0.73, "Google", "Kubernetes", "CWE-269", false, false),
    cve("CVE-2026-10004", "Cross-site scripting vulnerability in WordPress plugin allows stored script execution through crafted post metadata.", "Medium", 6.1, 0.42, "WordPress", "WordPress", "CWE-79", false, false),
    cve("CVE-2026-10005", "Supply chain compromise in CI/CD integration may expose tokens through build logs when debug mode is enabled.", "High", 7.8, 0.68, "GitHub", "GitHub Actions", "CWE-287", true, false),
  ];
  cves[0].kev = kev[0]; cves[0].knownRansomwareUse = true;
  cves[1].kev = kev[1];
  cves[4].kev = kev[2];
  const news = [
    newsItem("n1", "Emergency patch released for actively exploited gateway zero-day", "Security teams are urged to prioritize exposed gateways after exploit attempts were observed.", "CISA Advisories", "Zero-Day", ["CVE-2026-10001"], ["Microsoft"], ["Windows"], true),
    newsItem("n2", "Ransomware campaign targets exposed remote access devices", "Researchers observed double extortion activity against unpatched edge appliances.", "The Hacker News", "Ransomware", ["CVE-2026-10002"], ["Ivanti"], ["GlobalProtect"]),
    newsItem("n3", "Kubernetes releases fixes for node privilege escalation", "Administrators should review node exposure and apply updated packages across clusters.", "Google Security Blog", "Cloud Security", ["CVE-2026-10003"], ["Google"], ["Kubernetes"]),
    newsItem("n4", "Researchers detail prompt injection risks in enterprise AI copilots", "The report highlights data leakage and model security controls for generative AI deployments.", "Dark Reading", "AI Security", [], ["Microsoft"], []),
    newsItem("n5", "Package compromise exposes CI/CD secrets in build logs", "Supply chain defenders are rotating tokens and reviewing GitHub Actions workflow permissions.", "BleepingComputer", "Supply Chain", ["CVE-2026-10005"], ["GitHub"], ["GitHub Actions"]),
    newsItem("n6", "Security update closes stored XSS flaw in WordPress plugin", "Site owners should install the latest plugin version and review contributor permissions.", "SecurityWeek", "Vulnerabilities", ["CVE-2026-10004"], ["WordPress"], ["WordPress"]),
    newsItem("n7", "Cloud IAM misconfiguration leads to exposed storage buckets", "Incident response teams continue finding overly permissive cloud roles in production tenants.", "Cloudflare Blog", "Cloud Security", [], ["Google"], []),
    newsItem("n8", "Threat actor campaign uses phishing to steal developer credentials", "The campaign targets package maintainers and attempts to bypass MFA with fake login pages.", "Cisco Talos", "Phishing", [], ["GitHub"], []),
    newsItem("n9", "Malware loader adds exploit chain for public proof-of-concept", "Threat intelligence teams observed weaponized exploit code in a loader campaign.", "Palo Alto Unit 42", "Malware", ["CVE-2026-10001"], ["Microsoft"], ["Windows"]),
    newsItem("n10", "Government agencies publish joint advisory on exploited vulnerabilities", "The advisory recommends rapid triage of KEV entries and internet-facing services.", "CISA Advisories", "Government Advisories", ["CVE-2026-10002"], ["Ivanti"], []),
  ];
  return { generatedAt, cves, kev, news };
}

function kevItem(cveID, vendorProject, product, vulnerabilityName, knownRansomwareCampaignUse) {
  return {
    cveID,
    vendorProject,
    product,
    vulnerabilityName,
    dateAdded: "2026-05-25",
    dueDate: "2026-06-15",
    requiredAction: "Apply vendor update or remove exposed instances.",
    knownRansomwareCampaignUse,
    notes: "Fallback sample item used when live sources are unavailable.",
  };
}

function cve(id, summary, severity, cvssScore, epssPercentile, vendor, product, cweId, isKev, knownRansomwareUse) {
  const vector = "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H";
  return {
    id,
    summary,
    published: "2026-05-25T08:20:00.000Z",
    lastModified: "2026-05-25T12:20:00.000Z",
    severity,
    cvssScore,
    cvssVector: vector,
    cvssBreakdown: parseCvssVector(vector),
    epssScore: epssPercentile / 1.2,
    epssPercentile,
    isKev,
    kev: null,
    vendor,
    product,
    cwe: [{ id: cweId, name: cweId, description: "Sample CWE mapping." }],
    references: [`https://example.com/advisory/${id.toLowerCase()}`],
    vendorAdvisoryLinks: [`https://example.com/advisory/${id.toLowerCase()}`],
    exploitAvailable: /exploit|command execution|authentication bypass/i.test(summary),
    patchAvailable: true,
    workaroundAvailable: true,
    recentlyPublished: true,
    recentlyModified: true,
    knownRansomwareUse,
    priorityScore: Math.round((cvssScore * 0.35 + epssPercentile * 10 * 0.35 + (isKev ? 2 : 0) + 1) * 100) / 100,
    tags: [vendor, product, cweId],
  };
}

function newsItem(id, title, summary, source, category, relatedCves, matchedVendors, matchedProducts, breaking = false) {
  const url = `https://example.com/news/${id}`;
  return {
    id,
    title,
    summary,
    source,
    category,
    published: "2026-05-25T15:40:00.000Z",
    url,
    canonicalUrl: url,
    tags: [category, ...relatedCves, ...matchedVendors, ...matchedProducts],
    breaking,
    duplicateGroupId: null,
    relatedCves,
    matchedVendors,
    matchedProducts,
  };
}
