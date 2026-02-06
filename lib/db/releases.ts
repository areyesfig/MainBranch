/**
 * Capa de acceso a datos para releases
 */

import { prisma } from "@/lib/db";
import type { ReleaseNote } from "@/types/release";

function parseJson<T>(json: string | null): T | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}

/**
 * Convierte un registro de BD a ReleaseNote
 */
function dbToReleaseNote(
  r: Awaited<ReturnType<typeof prisma.release.findFirst>>
): ReleaseNote | null {
  if (!r) return null;

  return {
    id: r.id,
    technology: r.technology,
    version: r.version,
    releaseDate: r.releaseDate,
    tldr: r.tldr,
    description: r.description,
    breakingChange: r.breakingChange,
    features: parseJson<string[]>(r.features),
    improvements: parseJson<string[]>(r.improvements),
    bugFixes: parseJson<string[]>(r.bugFixes),
    breakingChanges: parseJson<string[]>(r.breakingChanges),
    officialUrl: r.officialUrl ?? undefined,
    tags: parseJson<string[]>(r.tags),
    stack: r.stack ?? undefined,
    category: r.category ?? undefined,
    previousVersion: r.previousVersion ?? undefined,
    estimatedMigrationTime: r.estimatedMigrationTime ?? undefined,
    migrationComplexity: r.migrationComplexity as ReleaseNote["migrationComplexity"] ?? undefined,
  };
}

/**
 * Inserta o actualiza un release (upsert por technology + version)
 */
export async function upsertRelease(release: ReleaseNote, sourceId: string) {
  return prisma.release.upsert({
    where: {
      technology_version: {
        technology: release.technology,
        version: release.version,
      },
    },
    create: {
      sourceId,
      technology: release.technology,
      version: release.version,
      releaseDate: new Date(release.releaseDate),
      tldr: release.tldr,
      description: release.description ?? "",
      breakingChange: release.breakingChange ?? false,
      features: release.features ? JSON.stringify(release.features) : null,
      improvements: release.improvements ? JSON.stringify(release.improvements) : null,
      bugFixes: release.bugFixes ? JSON.stringify(release.bugFixes) : null,
      breakingChanges: release.breakingChanges ? JSON.stringify(release.breakingChanges) : null,
      officialUrl: release.officialUrl ?? null,
      tags: release.tags ? JSON.stringify(release.tags) : null,
      stack: release.stack ?? null,
      category: release.category ?? null,
      previousVersion: release.previousVersion ?? null,
      estimatedMigrationTime: release.estimatedMigrationTime ?? null,
      migrationComplexity: release.migrationComplexity ?? null,
    },
    update: {
      tldr: release.tldr,
      description: release.description ?? "",
      breakingChange: release.breakingChange ?? false,
      features: release.features ? JSON.stringify(release.features) : null,
      improvements: release.improvements ? JSON.stringify(release.improvements) : null,
      bugFixes: release.bugFixes ? JSON.stringify(release.bugFixes) : null,
      breakingChanges: release.breakingChanges ? JSON.stringify(release.breakingChanges) : null,
      officialUrl: release.officialUrl ?? null,
      tags: release.tags ? JSON.stringify(release.tags) : null,
      stack: release.stack ?? null,
      category: release.category ?? null,
    },
  });
}

/**
 * Inserta múltiples releases (upsert)
 */
export async function upsertReleases(
  releases: ReleaseNote[],
  sourceId: string
): Promise<{ created: number; updated: number; errors: string[] }> {
  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const release of releases) {
    try {
      const result = await upsertRelease(release, sourceId);
      // Prisma upsert siempre retorna - no podemos distinguir created vs updated fácilmente
      created++;
    } catch (error) {
      errors.push(
        `${release.technology} ${release.version}: ${error instanceof Error ? error.message : "Error"}`
      );
    }
  }

  return { created, updated, errors };
}

/**
 * Obtiene todos los releases de la BD
 */
export async function getReleasesFromDb(): Promise<ReleaseNote[]> {
  const releases = await prisma.release.findMany({
    orderBy: { releaseDate: "desc" },
  });
  return releases.map((r) => dbToReleaseNote(r)!).filter(Boolean);
}

/**
 * Obtiene releases por stack
 */
export async function getReleasesByStackFromDb(
  stack: string | null
): Promise<ReleaseNote[]> {
  if (!stack) return getReleasesFromDb();
  const releases = await prisma.release.findMany({
    where: { stack },
    orderBy: { releaseDate: "desc" },
  });
  return releases.map((r) => dbToReleaseNote(r)!).filter(Boolean);
}

/**
 * Obtiene releases por categoría
 */
export async function getReleasesByCategoryFromDb(
  category: string | null
): Promise<ReleaseNote[]> {
  if (!category) return getReleasesFromDb();
  const releases = await prisma.release.findMany({
    where: { category },
    orderBy: { releaseDate: "desc" },
  });
  return releases.map((r) => dbToReleaseNote(r)!).filter(Boolean);
}

/**
 * Obtiene un release por ID
 */
export async function getReleaseByIdFromDb(id: string): Promise<ReleaseNote | null> {
  const release = await prisma.release.findUnique({
    where: { id },
  });
  return dbToReleaseNote(release);
}

/**
 * Cuenta releases en la BD
 */
export async function getReleasesCount(): Promise<number> {
  return prisma.release.count();
}
