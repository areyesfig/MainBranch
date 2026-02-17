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
import { isPreRelease } from "@/lib/utils";

function filterStable(releases: ReleaseNote[]): ReleaseNote[] {
  return releases.filter((r) => !isPreRelease(r.version));
}

let useDbCache: boolean | null = null;

/**
 * Determina si usar BD (tiene datos) o mock
 */
async function shouldUseDb(): Promise<boolean> {
  if (useDbCache !== null) return useDbCache;
  try {
    const count = await getReleasesCount();
    if (count > 0) {
      useDbCache = true;
      return true;
    }
    // No cachear false: re-intentar en el próximo request
    return false;
  } catch {
    // No cachear false: re-intentar en el próximo request
    return false;
  }
}

/**
 * Obtiene todos los releases (BD o mock)
 */
export async function getReleases(): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  const releases = useDb ? await getReleasesFromDb() : mockReleases;
  return filterStable(releases);
}

/**
 * Obtiene releases filtrados por stack (BD o mock)
 */
export async function getReleasesByStack(
  stack: string | null
): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  const releases = useDb
    ? await getReleasesByStackFromDb(stack)
    : filterReleasesByStack(stack);
  return filterStable(releases);
}

/**
 * Obtiene releases filtrados por categoría (BD o mock)
 */
export async function getReleasesByCategory(
  category: string | null
): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  let releases: ReleaseNote[];
  if (useDb) {
    releases = await getReleasesByCategoryFromDb(category);
  } else if (!category) {
    releases = mockReleases;
  } else {
    releases = mockReleases.filter((r) => r.category === category);
  }
  return filterStable(releases);
}

/**
 * Obtiene releases por múltiples stacks (BD o mock)
 */
export async function getReleasesByStacks(
  stacks: string[]
): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  let releases: ReleaseNote[];
  if (useDb) {
    const all = await getReleasesFromDb();
    releases = all.filter((r) => r.stack && stacks.includes(r.stack));
  } else {
    releases = filterReleasesByStacks(stacks);
  }
  return filterStable(releases);
}

/**
 * Busca releases por texto (BD o mock)
 */
export async function searchReleasesAsync(
  query: string
): Promise<ReleaseNote[]> {
  const useDb = await shouldUseDb();
  let releases: ReleaseNote[];
  if (useDb) {
    const all = await getReleasesFromDb();
    if (!query.trim()) {
      releases = all;
    } else {
      const lowerQuery = query.toLowerCase().trim();
      releases = all.filter((release) => {
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
  } else {
    releases = searchReleases(query);
  }
  return filterStable(releases);
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
