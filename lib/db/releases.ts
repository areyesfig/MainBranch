/**
 * Capa de acceso a datos para releases
 */

import { prisma } from "@/lib/db";
import { validateReleaseForDb } from "@/lib/schemas/release";
import type { ReleaseNote } from "@/types/release";
import {
  cacheGet,
  cacheSet,
  CACHE_KEYS,
  CACHE_TTL,
} from "@/lib/cache/redis";

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
    impactScore: r.impactScore ?? undefined,
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
      impactScore: release.impactScore ?? 0,
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
      impactScore: release.impactScore ?? 0,
    },
  });
}

/**
 * Inserta múltiples releases (upsert).
 * Valida cada ítem con Zod antes de llamar a Prisma; los inválidos se registran en errors.
 */
export async function upsertReleases(
  releases: ReleaseNote[],
  sourceId: string
): Promise<{ created: number; updated: number; errors: string[] }> {
  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const release of releases) {
    const validated = validateReleaseForDb(release);
    if (!validated.success) {
      const msg = validated.error.flatten().formErrors.join("; ") || validated.error.message;
      errors.push(
        `${release.technology ?? "?"} ${release.version ?? "?"}: validación ${msg}`
      );
      continue;
    }

    try {
      await upsertRelease(release, sourceId);
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
 * Obtiene todos los releases de la BD (con caché Redis si está disponible)
 */
export async function getReleasesFromDb(): Promise<ReleaseNote[]> {
  const cached = await cacheGet<ReleaseNote[]>(CACHE_KEYS.ALL);
  if (cached) return cached;

  const releases = await prisma.release.findMany({
    orderBy: { releaseDate: "desc" },
  });
  const result = releases.map((r) => dbToReleaseNote(r)!).filter(Boolean);
  await cacheSet(CACHE_KEYS.ALL, result);
  return result;
}

/**
 * Obtiene releases por stack (con caché Redis si está disponible)
 */
export async function getReleasesByStackFromDb(
  stack: string | null
): Promise<ReleaseNote[]> {
  if (!stack) return getReleasesFromDb();

  const key = CACHE_KEYS.STACK(stack);
  const cached = await cacheGet<ReleaseNote[]>(key);
  if (cached) return cached;

  const releases = await prisma.release.findMany({
    where: { stack },
    orderBy: { releaseDate: "desc" },
  });
  const result = releases.map((r) => dbToReleaseNote(r)!).filter(Boolean);
  await cacheSet(key, result);
  return result;
}

/**
 * Obtiene releases por categoría (con caché Redis si está disponible)
 */
export async function getReleasesByCategoryFromDb(
  category: string | null
): Promise<ReleaseNote[]> {
  if (!category) return getReleasesFromDb();

  const key = CACHE_KEYS.CATEGORY(category);
  const cached = await cacheGet<ReleaseNote[]>(key);
  if (cached) return cached;

  const releases = await prisma.release.findMany({
    where: { category },
    orderBy: { releaseDate: "desc" },
  });
  const result = releases.map((r) => dbToReleaseNote(r)!).filter(Boolean);
  await cacheSet(key, result);
  return result;
}

/**
 * Obtiene un release por ID (con caché Redis si está disponible)
 */
export async function getReleaseByIdFromDb(id: string): Promise<ReleaseNote | null> {
  const key = CACHE_KEYS.ID(id);
  const cached = await cacheGet<ReleaseNote>(key);
  if (cached) return cached;

  const release = await prisma.release.findUnique({ where: { id } });
  const result = dbToReleaseNote(release);
  if (result) await cacheSet(key, result);
  return result;
}

/**
 * Obtiene releases en un rango de fechas (sin caché — clave demasiado dinámica)
 */
export async function getReleasesInRange(
  startDate: Date,
  endDate: Date
): Promise<ReleaseNote[]> {
  const releases = await prisma.release.findMany({
    where: {
      releaseDate: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: { releaseDate: "desc" },
  });
  return releases.map((r) => dbToReleaseNote(r)!).filter(Boolean);
}

/**
 * Cuenta releases en la BD (con caché corta — 5 min)
 */
export async function getReleasesCount(): Promise<number> {
  const cached = await cacheGet<number>(CACHE_KEYS.COUNT);
  if (cached !== null) return cached;

  const count = await prisma.release.count();
  await cacheSet(CACHE_KEYS.COUNT, count, CACHE_TTL.SHORT);
  return count;
}

/**
 * Cuenta releases de una tecnología en los últimos N días
 */
export async function getRecentReleaseCount(
  technology: string,
  days: number = 30
): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return prisma.release.count({
    where: {
      technology,
      releaseDate: { gte: since },
    },
  });
}
