/**
 * Capa unificada de datos: BD con fallback a mock
 */

import type { ReleaseNote } from "@/types/release";
import {
  getReleasesFromDb,
  getReleasesByStackFromDb,
  getReleasesByCategoryFromDb,
  getReleaseByIdFromDb,
  getReleasesCount,
} from "@/lib/db/releases";
import {
  mockReleases,
  filterReleasesByStack,
  filterReleasesByStacks,
  searchReleases,
} from "@/lib/mockData";

let useDbCache: boolean | null = null;

/**
 * Determina si usar BD (tiene datos) o mock
 */
async function shouldUseDb(): Promise<boolean> {
  if (useDbCache !== null) return useDbCache;
  try {
    const count = await getReleasesCount();
    useDbCache = count > 0;
    return useDbCache;
  } catch {
    useDbCache = false;
    return false;
  }
}

/**
 * Obtiene todos los releases (BD o mock)
 */
export async function getReleases(): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  if (useDb) {
    return getReleasesFromDb();
  }
  return mockReleases;
}

/**
 * Obtiene releases filtrados por stack (BD o mock)
 */
export async function getReleasesByStack(
  stack: string | null
): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  if (useDb) {
    return getReleasesByStackFromDb(stack);
  }
  return filterReleasesByStack(stack);
}

/**
 * Obtiene releases filtrados por categoría (BD o mock)
 */
export async function getReleasesByCategory(
  category: string | null
): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  if (useDb) {
    return getReleasesByCategoryFromDb(category);
  }
  if (!category) return mockReleases;
  return mockReleases.filter((r) => r.category === category);
}

/**
 * Obtiene releases por múltiples stacks (BD o mock)
 */
export async function getReleasesByStacks(
  stacks: string[]
): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  if (useDb) {
    const all = await getReleasesFromDb();
    return all.filter((r) => r.stack && stacks.includes(r.stack));
  }
  return filterReleasesByStacks(stacks);
}

/**
 * Busca releases por texto (BD o mock)
 */
export async function searchReleasesAsync(
  query: string
): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  if (useDb) {
    const all = await getReleasesFromDb();
    if (!query.trim()) return all;
    const lowerQuery = query.toLowerCase().trim();
    return all.filter((release) => {
      const searchableText = [
        release.technology,
        release.version,
        release.tldr,
        release.description,
        release.category,
        ...(release.features || []),
        ...(release.breakingChanges || []),
        ...(release.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(lowerQuery);
    });
  }
  return searchReleases(query);
}

/**
 * Obtiene un release por ID (BD o mock)
 */
export async function getReleaseById(id: string): Promise<ReleaseNote | null> {
  const useDb = await shouldUseDb();
  if (useDb) {
    return getReleaseByIdFromDb(id);
  }
  return mockReleases.find((r) => r.id === id) ?? null;
}

/**
 * Invalida el caché (llamar después de sync)
 */
export function invalidateReleasesCache() {
  useDbCache = null;
}
