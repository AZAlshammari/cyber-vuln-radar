import { apiSources } from "./config/sources.mjs";
import { fetchJson, sourceRecord } from "./utils.mjs";

export async function fetchKev() {
  const source = apiSources.find((item) => item.name === "CISA KEV");
  try {
    const data = await fetchJson(source);
    const items = (data.vulnerabilities || []).map((item) => ({
      cveID: item.cveID,
      vendorProject: item.vendorProject || "",
      product: item.product || "",
      vulnerabilityName: item.vulnerabilityName || "",
      dateAdded: item.dateAdded || "",
      dueDate: item.dueDate || "",
      requiredAction: item.requiredAction || "",
      knownRansomwareCampaignUse: item.knownRansomwareCampaignUse || "Unknown",
      notes: item.notes || "",
    }));
    return { items, source: sourceRecord(source, "ok", items.length) };
  } catch (error) {
    return { items: [], source: sourceRecord(source, "failed", 0, error.message), error };
  }
}
