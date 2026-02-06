/**
 * Pipeline principal: Fetch -> Parse -> Transform -> Persist
 *
 * Flujo:
 * 1. Obtener fuentes activas
 * 2. Fetch según tipo (RSS, API)
 * 3. Transformar a ReleaseNote
 * 4. Persistir en BD
 * 5. Retornar resultados
 */

import { getActiveSources } from "@/lib/sources/config";
import { fetchRss } from "./fetchers/rss";
import { fetchApi } from "./fetchers/api";
import { transformRssItem } from "./transformers/toReleaseNote";
import { transformApiItem } from "./transformers/toReleaseNote";
import { upsertReleases } from "@/lib/db/releases";
import type { DataSource, RawFetchResult, PipelineResult } from "@/types/sources";
import type { ReleaseNote } from "@/types/release";

/**
 * Ejecuta el pipeline para una sola fuente
 */
export async function runPipelineForSource(
  source: DataSource
): Promise<PipelineResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let releases: ReleaseNote[] = [];

  try {
    let rawResult: RawFetchResult;

    switch (source.type) {
      case "rss":
        rawResult = await fetchRss(source);
        releases = rawResult.items.map((item, i) =>
          transformRssItem(item, source, i)
        );
        break;
      case "api":
        rawResult = await fetchApi(source);
        releases = rawResult.items.map((item, i) =>
          transformApiItem(item, source, i)
        );
        break;
      case "scraping":
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

    if (!rawResult!.success && rawResult!.error) {
      errors.push(rawResult!.error);
    }

    // Persistir en BD
    if (releases.length > 0) {
      try {
        const { errors: dbErrors } = await upsertReleases(releases, source.id);
        errors.push(...dbErrors);
      } catch (dbError) {
        errors.push(
          `BD: ${dbError instanceof Error ? dbError.message : "Error al guardar"}`
        );
      }
    }

    return {
      sourceId: source.id,
      releases,
      rawCount: rawResult!.items.length,
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
export async function runFullPipeline(): Promise<{
  results: PipelineResult[];
  allReleases: ReleaseNote[];
  totalDuration: number;
}> {
  const startTime = Date.now();
  const sources = getActiveSources();

  const results = await Promise.all(
    sources.map((source) => runPipelineForSource(source))
  );

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
