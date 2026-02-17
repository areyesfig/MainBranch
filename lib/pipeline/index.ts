/**
 * Pipeline principal: Fetch -> Parse -> Transform -> Persist
 *
 * Flujo:
 * 1. Obtener fuentes activas (o una por ID)
 * 2. Factory devuelve el fetcher según tipo de fuente
 * 3. Fetch -> Transformar a ReleaseNote -> Validar (Zod) -> Persistir
 */

import { getActiveSources } from "@/lib/sources/config";
import { getFetcher } from "./fetchers/FetcherFactory";
import { transformRssItem } from "./transformers/toReleaseNote";
import { transformApiItem } from "./transformers/toReleaseNote";
import { upsertReleases, getRecentReleaseCount } from "@/lib/db/releases";
import { calculateImpactScore } from "./scoring/impactScore";
import type { DataSource, RawFetchResult, PipelineResult } from "@/types/sources";
import type { ReleaseNote } from "@/types/release";

/**
 * Ejecuta el pipeline para una sola fuente.
 * La fuente se identifica por objeto (resuelto por ID en api/sync).
 */
export async function runPipelineForSource(
  source: DataSource
): Promise<PipelineResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let releases: ReleaseNote[] = [];

  try {
    let rawResult: RawFetchResult;

    if (source.type === "scraping") {
      errors.push("Scraping no implementado - requiere Puppeteer/Playwright");
      return {
        sourceId: source.id,
        releases: [],
        rawCount: 0,
        transformedCount: 0,
        errors,
        duration: Date.now() - startTime,
      };
    }

    console.log(`[pipeline] Fetching ${source.id} (${source.type})...`);
    const fetcher = getFetcher(source);
    rawResult = await fetcher.fetch(source);

    if (source.type === "rss") {
      releases = rawResult.items.map((item, i) =>
        transformRssItem(item, source, i)
      );
    } else if (source.type === "api") {
      releases = rawResult.items.map((item, i) =>
        transformApiItem(item, source, i)
      );
    }

    if (!rawResult.success && rawResult.error) {
      console.error(`[pipeline] Error en ${source.id}: ${rawResult.error}`);
      errors.push(rawResult.error);
    }

    // Calcular impact score para cada release
    if (releases.length > 0) {
      try {
        const recentCount = await getRecentReleaseCount(source.technology);
        for (const release of releases) {
          release.impactScore = await calculateImpactScore(
            release,
            source,
            recentCount
          );
        }
      } catch (scoreError) {
        console.warn(
          `[pipeline] Error calculando impactScore para ${source.id}:`,
          scoreError instanceof Error ? scoreError.message : scoreError
        );
      }
    }

    // Persistir en BD
    if (releases.length > 0) {
      try {
        const { errors: dbErrors } = await upsertReleases(releases, source.id);
        if (dbErrors.length > 0) {
          console.error(`[pipeline] DB errors for ${source.id}:`, dbErrors);
        }
        errors.push(...dbErrors);
      } catch (dbError) {
        const msg = `BD: ${dbError instanceof Error ? dbError.message : "Error al guardar"}`;
        console.error(`[pipeline] ${msg}`);
        errors.push(msg);
      }
    }

    console.log(`[pipeline] ${source.id}: ${rawResult.items.length} raw → ${releases.length} releases (${Date.now() - startTime}ms)`);

    return {
      sourceId: source.id,
      releases,
      rawCount: rawResult.items.length,
      transformedCount: releases.length,
      errors,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : "Error desconocido en pipeline"
    );
    return {
      sourceId: source.id,
      releases: [],
      rawCount: 0,
      transformedCount: 0,
      errors,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Ejecuta el pipeline para todas las fuentes activas
 */
const BATCH_SIZE = 10;

export async function runFullPipeline(): Promise<{
  results: PipelineResult[];
  allReleases: ReleaseNote[];
  totalDuration: number;
}> {
  const startTime = Date.now();
  const sources = getActiveSources();
  const results: PipelineResult[] = [];

  // Procesar en lotes para evitar saturar conexiones y timeouts
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    console.log(`[pipeline] Procesando lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(sources.length / BATCH_SIZE)} (${batch.length} fuentes)`);
    const batchResults = await Promise.all(
      batch.map((source) => runPipelineForSource(source))
    );
    results.push(...batchResults);
  }

  const allReleases = results.flatMap((r) => r.releases);

  // Ordenar por fecha descendente
  allReleases.sort((a, b) => {
    const dateA = new Date(a.releaseDate).getTime();
    const dateB = new Date(b.releaseDate).getTime();
    return dateB - dateA;
  });

  return {
    results,
    allReleases,
    totalDuration: Date.now() - startTime,
  };
}
