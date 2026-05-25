export function canonicalizeUrl(value: string) {
  try {
    const url = new URL(value);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach((key) =>
      url.searchParams.delete(key),
    );
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.trim();
  }
}

export function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[!?.,:;]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+-\s+(the hacker news|bleepingcomputer|securityweek|dark reading)$/i, "")
    .trim();
}
