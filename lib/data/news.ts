/**
 * Capa unificada de datos para noticias: BD con fallback a mock
 */

import type { NewsArticle } from "@/types/news";
import {
  getNewsFromDb,
  getNewsByTopicFromDb,
  getNewsArticleByIdFromDb,
  getNewsCount,
} from "@/lib/db/news";
import { invalidateAllNewsCache } from "@/lib/cache/redis";

const mockNews: NewsArticle[] = [
  {
    id: "mock-news-1",
    sourceId: "techcrunch-ai",
    title: "OpenAI launches GPT-5 with advanced reasoning capabilities",
    titleEs: "OpenAI lanza GPT-5 con capacidades de razonamiento avanzado",
    summary:
      "OpenAI today unveiled GPT-5, its most advanced language model, with significant improvements in logical reasoning and contextual understanding.",
    summaryEs:
      "OpenAI presentó hoy GPT-5, su modelo de lenguaje más avanzado, con mejoras significativas en razonamiento lógico y comprensión contextual.",
    content: "",
    author: "TechCrunch Staff",
    sourceUrl: "https://techcrunch.com/example-openai-gpt5",
    sourceName: "TechCrunch AI",
    topic: "openai",
    tags: ["openai"],
    publishedAt: new Date("2026-02-20"),
  },
  {
    id: "mock-news-2",
    sourceId: "venturebeat-ai",
    title: "Google DeepMind unveils Gemini 2.5 with multimodal capabilities",
    titleEs: "Google DeepMind presenta Gemini 2.5 con capacidades multimodales",
    summary:
      "Gemini 2.5 introduces native real-time video processing and improvements in code generation.",
    summaryEs:
      "Gemini 2.5 introduce procesamiento nativo de video en tiempo real y mejoras en generación de código.",
    content: "",
    author: "VentureBeat Staff",
    sourceUrl: "https://venturebeat.com/example-gemini",
    sourceName: "VentureBeat AI",
    topic: "gemini",
    tags: ["gemini"],
    publishedAt: new Date("2026-02-19"),
  },
  {
    id: "mock-news-3",
    sourceId: "ai-news",
    title: "Anthropic announces Claude 4.5 with new long-context architecture",
    titleEs: "Anthropic anuncia Claude 4.5 con nueva arquitectura de contexto largo",
    summary:
      "Claude 4.5 supports up to 1 million context tokens, marking a significant advancement in language models.",
    summaryEs:
      "Claude 4.5 soporta hasta 1 millón de tokens de contexto, marcando un avance significativo en modelos de lenguaje.",
    content: "",
    author: "AI News Staff",
    sourceUrl: "https://artificialintelligence-news.com/example-claude",
    sourceName: "AI News",
    topic: "claude",
    tags: ["claude"],
    publishedAt: new Date("2026-02-18"),
  },
  {
    id: "mock-news-4",
    sourceId: "techcrunch-ai",
    title: "DeepSeek releases open-source model competing with GPT-5",
    titleEs: "DeepSeek lanza modelo open-source que compite con GPT-5",
    summary:
      "Chinese lab DeepSeek published an open-source model with performance comparable to leading commercial models.",
    summaryEs:
      "El laboratorio chino DeepSeek publicó un modelo de código abierto con rendimiento comparable a los principales modelos comerciales.",
    content: "",
    sourceUrl: "https://techcrunch.com/example-deepseek",
    sourceName: "TechCrunch AI",
    topic: "deepseek",
    tags: ["deepseek"],
    publishedAt: new Date("2026-02-17"),
  },
];

let useDbCache: boolean | null = null;

async function shouldUseDb(): Promise<boolean> {
  if (useDbCache !== null) return useDbCache;
  try {
    const count = await getNewsCount();
    if (count > 0) {
      useDbCache = true;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function getNews(): Promise<NewsArticle[]> {
  const useDb = await shouldUseDb();
  return useDb ? await getNewsFromDb() : mockNews;
}

export async function getNewsByTopic(
  topic: string | null
): Promise<NewsArticle[]> {
  if (!topic) return getNews();
  const useDb = await shouldUseDb();
  if (useDb) {
    return getNewsByTopicFromDb(topic);
  }
  return mockNews.filter((n) => n.topic === topic);
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const useDb = await shouldUseDb();
  if (useDb) {
    return getNewsArticleByIdFromDb(id);
  }
  return mockNews.find((n) => n.id === id) ?? null;
}

/**
 * Invalida el caché de noticias (llamar después de sync)
 */
export function invalidateNewsCache() {
  useDbCache = null;
  invalidateAllNewsCache().catch(() => {});
}
