/**
 * Script de backfill: calcula impactScore para todos los releases existentes.
 * Uso: npx tsx scripts/backfillImpactScore.ts
 */

import { prisma } from "../lib/db";
import {
  getVersionTypeScore,
  getBreakingChangeScore,
  getNpmPopularityScore,
  getReleaseFrequencyScore,
  getSecurityScore,
} from "../lib/pipeline/scoring/impactScore";
import { RSS_SOURCES, API_SOURCES } from "../lib/sources/config";
import type { ReleaseNote } from "../types/release";

// Mapeo technology → npmPackage desde las sources configuradas
const npmPackageMap = new Map<string, string>();
for (const source of [...RSS_SOURCES, ...API_SOURCES]) {
  if (source.npmPackage) {
    npmPackageMap.set(source.technology, source.npmPackage);
  }
}

function parseJson<T>(json: string | null): T | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}

async function main() {
  const releases = await prisma.release.findMany({
    orderBy: { releaseDate: "desc" },
  });

  console.log(`Procesando ${releases.length} releases...`);

  // Cache de conteos recientes por tecnología
  const recentCountCache = new Map<string, number>();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  for (const r of releases) {
    if (!recentCountCache.has(r.technology)) {
      const count = await prisma.release.count({
        where: {
          technology: r.technology,
          releaseDate: { gte: thirtyDaysAgo },
        },
      });
      recentCountCache.set(r.technology, count);
    }
  }

  // Cache de popularidad npm para no repetir fetches
  const npmScoreCache = new Map<string, number>();

  let processed = 0;
  let updated = 0;

  for (const r of releases) {
    const release: Partial<ReleaseNote> = {
      technology: r.technology,
      version: r.version,
      previousVersion: r.previousVersion ?? undefined,
      breakingChange: r.breakingChange,
      breakingChanges: parseJson<string[]>(r.breakingChanges),
      tldr: r.tldr,
      description: r.description,
      securityAlerts: undefined,
    };

    const npmPackage = npmPackageMap.get(r.technology);

    const versionScore = getVersionTypeScore(r.version, r.previousVersion ?? undefined);
    const breakingScore = getBreakingChangeScore(release as ReleaseNote);
    const frequencyScore = getReleaseFrequencyScore(recentCountCache.get(r.technology) ?? 0);
    const securityScore = getSecurityScore(release as ReleaseNote);

    let npmScore: number;
    const cacheKey = npmPackage ?? "__none__";
    if (npmScoreCache.has(cacheKey)) {
      npmScore = npmScoreCache.get(cacheKey)!;
    } else {
      npmScore = await getNpmPopularityScore(npmPackage);
      npmScoreCache.set(cacheKey, npmScore);
    }

    const total = Math.max(0, Math.min(100, versionScore + breakingScore + npmScore + frequencyScore + securityScore));

    if (total !== (r.impactScore ?? 0)) {
      await prisma.release.update({
        where: { id: r.id },
        data: { impactScore: total },
      });
      updated++;
    }

    processed++;
    if (processed % 20 === 0) {
      console.log(`  ${processed}/${releases.length} procesados, ${updated} actualizados...`);
    }
  }

  console.log(`\nCompletado: ${processed} procesados, ${updated} actualizados.`);

  // Mostrar distribución de scores
  const distribution = await prisma.release.groupBy({
    by: ["technology"],
    _avg: { impactScore: true },
    _max: { impactScore: true },
    orderBy: { _max: { impactScore: "desc" } },
    take: 10,
  });

  console.log("\nTop 10 tecnologías por impacto promedio:");
  for (const d of distribution) {
    console.log(`  ${d.technology}: avg=${d._avg.impactScore?.toFixed(0)} max=${d._max.impactScore}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
