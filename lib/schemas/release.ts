/**
 * Esquemas Zod para validar datos de releases antes de persistir en BD.
 * Alineados con el modelo Release en prisma/schema.prisma.
 */

import { z } from "zod";

const dateSchema = z.union([z.date(), z.string()]).transform((v) =>
  v instanceof Date ? v : new Date(v)
);

const migrationComplexitySchema = z.enum(["low", "medium", "high", "critical"]).nullable().optional();

const optionalStringArray = z.array(z.string()).nullable().optional();
const optionalString = z.string().nullable().optional();
const optionalNumber = z.number().int().nullable().optional();

/**
 * Esquema para un release que viene del pipeline, antes de prisma.release.create/upsert.
 * Campos requeridos según schema.prisma (sin id, sourceId se inyecta en la capa de BD).
 */
export const releaseForDbSchema = z.object({
  id: z.string().optional(),
  technology: z.string().min(1, "technology es requerido"),
  version: z.string().min(1, "version es requerida"),
  releaseDate: dateSchema,
  tldr: z.string().min(1, "tldr es requerido"),
  description: z.string().default(""),
  breakingChange: z.boolean().default(false),
  features: optionalStringArray,
  improvements: optionalStringArray,
  bugFixes: optionalStringArray,
  breakingChanges: optionalStringArray,
  officialUrl: optionalString,
  tags: optionalStringArray,
  stack: optionalString,
  category: optionalString,
  previousVersion: optionalString,
  estimatedMigrationTime: optionalNumber,
  migrationComplexity: migrationComplexitySchema,
});

export type ReleaseForDb = z.infer<typeof releaseForDbSchema>;

/**
 * Valida un objeto como ReleaseNote del pipeline y devuelve el dato listo para BD
 * o lanza/retorna errores según preferencia. Aquí usamos safeParse y retornamos resultado.
 */
export function validateReleaseForDb(data: unknown) {
  return releaseForDbSchema.safeParse(data);
}
