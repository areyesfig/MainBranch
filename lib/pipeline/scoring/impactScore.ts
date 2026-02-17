/**
 * Módulo de cálculo de Impact Score (0-100) para releases.
 *
 * Factores:
 * - Tipo de versión (major/minor/patch): 0-30 pts
 * - Breaking changes: 0-20 pts
 * - Popularidad npm (descargas/semana): 0-25 pts
 * - Frecuencia de releases (últimos 30 días): 0-15 pts
 * - Security fixes: 0-10 pts
 */

import type { ReleaseNote } from "@/types/release";
import type { DataSource } from "@/types/sources";

// --- Cache de popularidad npm (TTL 24h) ---

interface NpmCacheEntry {
  downloads: number;
  fetchedAt: number;
}

const npmCache = new Map<string, NpmCacheEntry>();
const NPM_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Parsea una versión semver simple, devolviendo [major, minor, patch].
 * Soporta prefijos como "v" y sufijos pre-release.
 */
export function parseVersion(version: string): [number, number, number] | null {
  const match = version.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

/**
 * Score por tipo de versión (0-30).
 * Compara con previousVersion si existe; si no, analiza solo la versión actual.
 */
export function getVersionTypeScore(
  version: string,
  previousVersion?: string
): number {
  const current = parseVersion(version);
  if (!current) {
    // Pre-release sin semver claro
    if (/alpha|beta|rc|canary|nightly|dev|preview/i.test(version)) return 2;
    return 5;
  }

  if (previousVersion) {
    const prev = parseVersion(previousVersion);
    if (prev) {
      if (current[0] > prev[0]) return 30; // major
      if (current[1] > prev[1]) return 15; // minor
      return 5; // patch
    }
  }

  // Sin previousVersion: inferir por la versión
  if (current[2] === 0 && current[1] === 0) return 30; // x.0.0 → major
  if (current[2] === 0) return 15; // x.y.0 → minor
  return 5; // patch
}

/**
 * Score por breaking changes (0-20).
 */
export function getBreakingChangeScore(release: ReleaseNote): number {
  if (!release.breakingChange) return 0;

  let score = 10; // base por tener breakingChange=true
  const count = release.breakingChanges?.length ?? 0;
  score += Math.min(count * 2, 10); // +2 por cada item, máx 10 extra
  return Math.min(score, 20);
}

/**
 * Obtiene descargas semanales de npm para un paquete.
 * Usa cache en memoria con TTL de 24h.
 */
export async function fetchNpmDownloads(
  npmPackage: string
): Promise<number> {
  const cached = npmCache.get(npmPackage);
  if (cached && Date.now() - cached.fetchedAt < NPM_CACHE_TTL) {
    return cached.downloads;
  }

  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${npmPackage}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return 0;
    const data = (await res.json()) as { downloads?: number };
    const downloads = data.downloads ?? 0;
    npmCache.set(npmPackage, { downloads, fetchedAt: Date.now() });
    return downloads;
  } catch {
    return 0;
  }
}

/**
 * Score por popularidad npm (0-25).
 * Escala logarítmica basada en descargas semanales.
 */
export async function getNpmPopularityScore(
  npmPackage?: string
): Promise<number> {
  if (!npmPackage) return 10; // score neutro para tecnologías sin npm

  const downloads = await fetchNpmDownloads(npmPackage);
  if (downloads > 10_000_000) return 25;
  if (downloads > 1_000_000) return 20;
  if (downloads > 100_000) return 15;
  if (downloads > 10_000) return 10;
  if (downloads > 1_000) return 5;
  return 2;
}

/**
 * Score por frecuencia de releases (0-15).
 * Menos releases recientes = mayor impacto de cada uno.
 */
export function getReleaseFrequencyScore(releasesLast30Days: number): number {
  if (releasesLast30Days === 0) return 15;
  if (releasesLast30Days <= 2) return 12;
  if (releasesLast30Days <= 5) return 8;
  if (releasesLast30Days <= 10) return 5;
  return 2;
}

/**
 * Score por security fixes (0-10).
 * Detecta keywords de seguridad en el contenido del release.
 */
export function getSecurityScore(release: ReleaseNote): number {
  // Si tiene securityAlerts explícitos
  if (release.securityAlerts && release.securityAlerts.length > 0) return 10;

  const searchText = [release.tldr, release.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const securityKeywords = [
    "cve-",
    "security",
    "vulnerability",
    "xss",
    "sql injection",
    "rce",
    "remote code execution",
    "csrf",
    "ssrf",
  ];

  const hasSecurityKeyword = securityKeywords.some((kw) =>
    searchText.includes(kw)
  );
  return hasSecurityKeyword ? 7 : 0;
}

/**
 * Calcula el impact score total (0-100) para un release.
 */
export async function calculateImpactScore(
  release: ReleaseNote,
  source: DataSource,
  releasesLast30Days: number
): Promise<number> {
  const [versionScore, breakingScore, npmScore, frequencyScore, securityScore] =
    await Promise.all([
      Promise.resolve(
        getVersionTypeScore(release.version, release.previousVersion)
      ),
      Promise.resolve(getBreakingChangeScore(release)),
      getNpmPopularityScore(source.npmPackage),
      Promise.resolve(getReleaseFrequencyScore(releasesLast30Days)),
      Promise.resolve(getSecurityScore(release)),
    ]);

  const total =
    versionScore + breakingScore + npmScore + frequencyScore + securityScore;
  return Math.max(0, Math.min(100, total));
}

/**
 * Limpia el cache de npm (útil para tests).
 */
export function clearNpmCache(): void {
  npmCache.clear();
}
