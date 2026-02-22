/**
 * Esquema Zod para validar noticias antes de persistir en BD.
 */

import { z } from "zod";

const dateSchema = z.union([z.date(), z.string()]).transform((v) =>
  v instanceof Date ? v : new Date(v)
);

export const newsArticleForDbSchema = z.object({
  sourceId: z.string().min(1, "sourceId es requerido"),
  title: z.string().min(1, "title es requerido"),
  summary: z.string().min(1, "summary es requerido"),
  titleEs: z.string().nullable().optional(),
  summaryEs: z.string().nullable().optional(),
  content: z.string().default(""),
  author: z.string().nullable().optional(),
  sourceUrl: z.string().url("sourceUrl debe ser una URL válida"),
  sourceName: z.string().min(1, "sourceName es requerido"),
  topic: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  publishedAt: dateSchema,
});

export type NewsArticleForDb = z.infer<typeof newsArticleForDbSchema>;

export function validateNewsArticleForDb(data: unknown) {
  return newsArticleForDbSchema.safeParse(data);
}
