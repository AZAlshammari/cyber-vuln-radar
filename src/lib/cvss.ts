import type { CvssBreakdown } from "./types";

const labels: Record<string, Record<string, string>> = {
  AV: { N: "Network", A: "Adjacent", L: "Local", P: "Physical" },
  AC: { L: "Low", H: "High" },
  PR: { N: "None", L: "Low", H: "High" },
  UI: { N: "None", R: "Required" },
  S: { U: "Unchanged", C: "Changed" },
  C: { H: "High", L: "Low", N: "None" },
  I: { H: "High", L: "Low", N: "None" },
  A: { H: "High", L: "Low", N: "None" },
};

export function parseCvssVector(vector?: string | null): CvssBreakdown {
  const out: CvssBreakdown = {
    attackVector: null,
    attackComplexity: null,
    privilegesRequired: null,
    userInteraction: null,
    scope: null,
    confidentiality: null,
    integrity: null,
    availability: null,
  };
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
