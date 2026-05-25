import type { CweInfo } from "./types";

export const cweMap: Record<string, CweInfo> = {
  "CWE-79": { id: "CWE-79", name: "Cross-site Scripting", description: "Improper neutralization of input during web page generation." },
  "CWE-89": { id: "CWE-89", name: "SQL Injection", description: "Improper neutralization of special elements used in SQL commands." },
  "CWE-78": { id: "CWE-78", name: "OS Command Injection", description: "Improper neutralization of special elements used in OS commands." },
  "CWE-22": { id: "CWE-22", name: "Path Traversal", description: "Improper limitation of a pathname to a restricted directory." },
  "CWE-287": { id: "CWE-287", name: "Improper Authentication", description: "Authentication is missing or can be bypassed." },
  "CWE-269": { id: "CWE-269", name: "Improper Privilege Management", description: "Privileges are assigned, modified, or checked incorrectly." },
  "CWE-352": { id: "CWE-352", name: "Cross-Site Request Forgery", description: "A web request may execute without user intent." },
  "CWE-416": { id: "CWE-416", name: "Use After Free", description: "A program uses memory after it has been freed." },
  "CWE-787": { id: "CWE-787", name: "Out-of-bounds Write", description: "Writes data past the intended buffer boundary." },
  "CWE-502": { id: "CWE-502", name: "Deserialization of Untrusted Data", description: "Untrusted serialized data can alter control flow or objects." },
};

export function mapCwe(id: string): CweInfo {
  return cweMap[id] || { id, name: id, description: "CWE mapping from source data." };
}
