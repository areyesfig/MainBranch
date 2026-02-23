/**
 * Capa de acceso a datos para noticias AI
 */

import { prisma } from "@/lib/db";
import { validateNewsArticleForDb } from "@/lib/schemas/news";
import type { NewsArticle } from "@/types/news";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/cache/redis";

const NEWS_PREFIX = "mb:news";

const NEWS_CACHE_KEYS = {
  ALL: `${NEWS_PREFIX}:all`,
  TOPIC: (topic: string) => `${NEWS_PREFIX}:topic:${topic}`,
  ID: (id: string) => `${NEWS_PREFIX}:id:${id}`,
  COUNT: `${NEWS_PREFIX}:count`,
} as const;

function parseJson<T>(json: string | null): T | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}

function dbToNewsArticle(
  r: Awaited<ReturnType<typeof prisma.newsArticle.findFirst>>
): NewsArticle | null {
  if (!r) return null;
  return {
    id: r.id,
    sourceId: r.sourceId,
    title: r.title,
    summary: r.summary,
    titleEs: r.titleEs ?? undefined,
    summaryEs: r.summaryEs ?? undefined,
    content: r.content,
    contentEs: r.contentEs ?? undefined,
    author: r.author ?? undefined,
    sourceUrl: r.sourceUrl,
    sourceName: r.sourceName,
    topic: r.topic ?? undefined,
    tags: parseJson<string[]>(r.tags),
    imageUrl: r.imageUrl ?? undefined,
    votes: r.votes,
    publishedAt: r.publishedAt,
  };
}

/**
 * Inserta o actualiza una noticia (upsert por title + sourceName)
 */
export async function upsertNewsArticle(article: NewsArticle) {
  return prisma.newsArticle.upsert({
    where: {
      title_sourceName: {
        title: article.title,
        sourceName: article.sourceName,
      },
    },
    create: {
      sourceId: article.sourceId,
      title: article.title,
      summary: article.summary,
      titleEs: article.titleEs ?? null,
      summaryEs: article.summaryEs ?? null,
      content: article.content,
      contentEs: article.contentEs ?? null,
      author: article.author ?? null,
      sourceUrl: article.sourceUrl,
      sourceName: article.sourceName,
      topic: article.topic ?? null,
      tags: article.tags ? JSON.stringify(article.tags) : null,
      imageUrl: article.imageUrl ?? null,
      publishedAt: new Date(article.publishedAt),
    },
    update: {
      summary: article.summary,
      titleEs: article.titleEs ?? undefined,
      summaryEs: article.summaryEs ?? undefined,
      content: article.content,
      contentEs: article.contentEs ?? undefined,
      topic: article.topic ?? null,
      tags: article.tags ? JSON.stringify(article.tags) : null,
      imageUrl: article.imageUrl ?? null,
    },
  });
}

/**
 * Inserta múltiples noticias con validación Zod
 */
export async function upsertNewsArticles(
  articles: NewsArticle[]
): Promise<{ created: number; errors: string[] }> {
  let created = 0;
  const errors: string[] = [];

  for (const article of articles) {
    const validated = validateNewsArticleForDb(article);
    if (!validated.success) {
      const msg =
        validated.error.flatten().formErrors.join("; ") ||
        validated.error.message;
      errors.push(`${article.title.slice(0, 50)}: validación ${msg}`);
      continue;
    }

    try {
      await upsertNewsArticle(article);
      created++;
    } catch (error) {
      errors.push(
        `${article.title.slice(0, 50)}: ${error instanceof Error ? error.message : "Error"}`
      );
    }
  }

  return { created, errors };
}

/**
 * Obtiene todas las noticias (con caché Redis)
 */
export async function getNewsFromDb(): Promise<NewsArticle[]> {
  const cached = await cacheGet<NewsArticle[]>(NEWS_CACHE_KEYS.ALL);
  if (cached) return cached;

  const articles = await prisma.newsArticle.findMany({
    orderBy: { publishedAt: "desc" },
    take: 100,
  });
  const result = articles.map((r) => dbToNewsArticle(r)!).filter(Boolean);
  await cacheSet(NEWS_CACHE_KEYS.ALL, result);
  return result;
}

/**
 * Obtiene noticias filtradas por topic (con caché Redis)
 */
export async function getNewsByTopicFromDb(
  topic: string
): Promise<NewsArticle[]> {
  const key = NEWS_CACHE_KEYS.TOPIC(topic);
  const cached = await cacheGet<NewsArticle[]>(key);
  if (cached) return cached;

  const articles = await prisma.newsArticle.findMany({
    where: { topic },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });
  const result = articles.map((r) => dbToNewsArticle(r)!).filter(Boolean);
  await cacheSet(key, result);
  return result;
}

/**
 * Obtiene una noticia por ID (con caché Redis)
 */
export async function getNewsArticleByIdFromDb(
  id: string
): Promise<NewsArticle | null> {
  const key = NEWS_CACHE_KEYS.ID(id);
  const cached = await cacheGet<NewsArticle>(key);
  if (cached) return cached;

  const article = await prisma.newsArticle.findUnique({ where: { id } });
  const result = dbToNewsArticle(article);
  if (result) await cacheSet(key, result);
  return result;
}

/**
 * Cuenta noticias en la BD
 */
export async function getNewsCount(): Promise<number> {
  const cached = await cacheGet<number>(NEWS_CACHE_KEYS.COUNT);
  if (cached !== null) return cached;

  const count = await prisma.newsArticle.count();
  await cacheSet(NEWS_CACHE_KEYS.COUNT, count, CACHE_TTL.SHORT);
  return count;
}

/**
 * Incrementa votos de una noticia
 */
export async function incrementNewsVotes(id: string): Promise<number> {
  const updated = await prisma.newsArticle.update({
    where: { id },
    data: { votes: { increment: 1 } },
    select: { votes: true },
  });
  return updated.votes;
}

/**
 * Elimina noticias antiguas
 */
export async function deleteOldNews(olderThanDays: number = 90): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - olderThanDays);

  const { count } = await prisma.newsArticle.deleteMany({
    where: { publishedAt: { lt: cutoff } },
  });
  return count;
}
