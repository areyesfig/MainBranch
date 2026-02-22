/**
 * Pipeline de noticias AI: Fetch → Transform → Validate → Persist
 *
 * Reutiliza RssFetcher existente, pero con transformer propio.
 */

import { getActiveNewsSources } from "@/lib/sources/config";
import { getFetcher } from "./fetchers/FetcherFactory";
import { transformRssToNews } from "./transformers/toNewsArticle";
import { upsertNewsArticles } from "@/lib/db/news";
import { translateNewsArticle } from "@/lib/ai/translateNews";
import type { RssSource } from "@/types/sources";
import type { NewsArticle } from "@/types/news";

interface NewsPipelineResult {
  sourceId: string;
  articlesCount: number;
  errors: string[];
  duration: number;
}

/**
 * Ejecuta el pipeline de noticias para una sola fuente RSS
 */
export async function runNewsPipelineForSource(
  source: RssSource
): Promise<NewsPipelineResult> {
  const startTime = Date.now();
  const errors: string[] = [];

  try {
    console.log(`[news-pipeline] Fetching ${source.id}...`);
    const fetcher = getFetcher(source);
    const rawResult = await fetcher.fetch(source);

    if (!rawResult.success && rawResult.error) {
      console.error(`[news-pipeline] Error en ${source.id}: ${rawResult.error}`);
      errors.push(rawResult.error);
    }

    const articles: NewsArticle[] = rawResult.items
      .map((item) => transformRssToNews(item, source))
      .filter((a): a is NewsArticle => a !== null);

    // Traducir al español si hay API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && articles.length > 0) {
      for (const article of articles) {
        try {
          const { titleEs, summaryEs } = await translateNewsArticle(
            article.title,
            article.summary,
            apiKey
          );
          article.titleEs = titleEs;
          article.summaryEs = summaryEs;
        } catch (err) {
          console.warn(
            `[news-pipeline] Traducción falló para "${article.title.slice(0, 50)}":`,
            err instanceof Error ? err.message : err
          );
        }
      }
    }

    if (articles.length > 0) {
      const { errors: dbErrors } = await upsertNewsArticles(articles);
      if (dbErrors.length > 0) {
        console.error(`[news-pipeline] DB errors for ${source.id}:`, dbErrors);
      }
      errors.push(...dbErrors);
    }

    console.log(
      `[news-pipeline] ${source.id}: ${rawResult.items.length} raw → ${articles.length} artículos (${Date.now() - startTime}ms)`
    );

    return {
      sourceId: source.id,
      articlesCount: articles.length,
      errors,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : "Error desconocido en news pipeline"
    );
    return {
      sourceId: source.id,
      articlesCount: 0,
      errors,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Ejecuta el pipeline para todas las fuentes de noticias activas
 */
export async function runFullNewsPipeline(): Promise<{
  results: NewsPipelineResult[];
  totalArticles: number;
  totalDuration: number;
}> {
  const startTime = Date.now();
  const sources = getActiveNewsSources();
  const results: NewsPipelineResult[] = [];

  // Procesar fuentes en paralelo (son pocas)
  const batchResults = await Promise.all(
    sources.map((source) => runNewsPipelineForSource(source))
  );
  results.push(...batchResults);

  const totalArticles = results.reduce((sum, r) => sum + r.articlesCount, 0);

  console.log(
    `[news-pipeline] Total: ${totalArticles} artículos de ${results.length} fuentes (${Date.now() - startTime}ms)`
  );

  return {
    results,
    totalArticles,
    totalDuration: Date.now() - startTime,
  };
}
