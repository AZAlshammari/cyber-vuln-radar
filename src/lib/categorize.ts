export const vendors = [
  "Microsoft", "Apple", "Google", "Cisco", "Fortinet", "Palo Alto Networks", "VMware", "Citrix",
  "Ivanti", "Atlassian", "Adobe", "Oracle", "SAP", "Juniper", "F5", "SonicWall", "Linux",
  "Apache", "OpenSSL", "GitLab", "GitHub", "WordPress", "Chrome", "Android",
];

export const products = [
  "Windows", "Exchange", "SharePoint", "Chrome", "Android", "iOS", "FortiOS", "GlobalProtect",
  "vCenter", "Confluence", "Jira", "WordPress", "OpenSSL", "Apache", "Nginx", "Kubernetes", "Docker",
];

export const categoryRules: Record<string, string[]> = {
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

export function categorizeText(text: string) {
  const lower = text.toLowerCase();
  for (const [category, words] of Object.entries(categoryRules)) {
    if (words.some((word) => lower.includes(word))) return category;
  }
  return "General Cybersecurity";
}

export function detectTerms(text: string, dictionary: string[]) {
  const lower = text.toLowerCase();
  return dictionary.filter((term) => lower.includes(term.toLowerCase()));
}

export function extractCves(text: string) {
  return Array.from(new Set((text.match(/CVE-\d{4}-\d{4,8}/gi) || []).map((x) => x.toUpperCase())));
}
