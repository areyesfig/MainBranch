/**
 * Esquemas Zod para validar datos de digests.
 */

import { z } from "zod";

export const digestPeriodSchema = z.enum(["weekly", "monthly"]);

export type DigestPeriod = z.infer<typeof digestPeriodSchema>;

export const digestSchema = z.object({
  id: z.string().optional(),
  period: digestPeriodSchema,
  startDate: z.union([z.date(), z.string()]).transform((v) =>
    v instanceof Date ? v : new Date(v)
  ),
  endDate: z.union([z.date(), z.string()]).transform((v) =>
    v instanceof Date ? v : new Date(v)
  ),
  content: z.string().min(1, "content es requerido"),
  technologies: z.array(z.string()),
  releaseCount: z.number().int().min(0).default(0),
});

export function validateDigest(data: unknown) {
  return digestSchema.safeParse(data);
}
