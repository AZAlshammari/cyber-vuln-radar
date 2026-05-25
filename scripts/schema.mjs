import { z } from "zod";

export const cvesFileSchema = z.object({
  generatedAt: z.string(),
  count: z.number(),
  items: z.array(z.object({
    id: z.string(),
    summary: z.string(),
    published: z.string(),
    lastModified: z.string(),
    severity: z.enum(["Critical", "High", "Medium", "Low", "Unknown"]),
    cvssScore: z.number(),
    epssScore: z.number(),
    epssPercentile: z.number(),
    isKev: z.boolean(),
    priorityScore: z.number(),
  }).passthrough()),
});

export const genericEnvelopeSchema = z.object({
  generatedAt: z.string(),
  count: z.number(),
  items: z.array(z.unknown()),
});

export function validateFiles(files) {
  cvesFileSchema.parse(files.cves);
  genericEnvelopeSchema.parse(files.kev);
  genericEnvelopeSchema.parse(files.news);
  z.object({ generatedAt: z.string(), items: z.array(z.unknown()) }).parse(files.sources);
  z.object({ generatedAt: z.string(), status: z.enum(["ok", "partial", "failed"]), freshnessScore: z.number(), summary: z.object({ cveCount: z.number() }).passthrough() }).parse(files.meta);
}
