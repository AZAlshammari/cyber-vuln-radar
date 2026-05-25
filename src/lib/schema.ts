import { z } from "zod";

export const cveSchema = z.object({
  id: z.string(),
  summary: z.string(),
  published: z.string(),
  lastModified: z.string(),
  severity: z.enum(["Critical", "High", "Medium", "Low", "Unknown"]),
  cvssScore: z.number(),
  cvssVector: z.string().nullable(),
  epssScore: z.number(),
  epssPercentile: z.number(),
  isKev: z.boolean(),
  priorityScore: z.number(),
}).passthrough();

export const dataEnvelopeSchema = z.object({
  generatedAt: z.string(),
  count: z.number(),
  items: z.array(z.unknown()),
});
