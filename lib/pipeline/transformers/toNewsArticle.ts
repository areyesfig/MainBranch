/**
 * Transforma items RSS crudos a NewsArticle
 */

import type { NewsArticle } from "@/types/news";
import type { RawFeedItem, RssSource } from "@/types/sources";

const TOPIC_KEYWORDS: Record<string, string[]> = {
  openai: ["openai", "chatgpt", "gpt-4", "gpt-5", "gpt-4o", "dall-e", "sora", "o1", "o3"],
  claude: ["claude", "anthropic"],
  gemini: ["gemini", "google ai", "google deepmind", "bard"],
  deepseek: ["deepseek"],
  grok: ["grok", "xai", "x.ai"],
  mistral: ["mistral", "mixtral", "le chat"],
  meta: ["llama", "meta ai", "llama 3", "llama 4"],
  copilot: ["copilot", "github copilot"],
  apple: ["apple intelligence", "apple ai", "apple machine learning"],
  nvidia: ["nvidia", "cuda", "tensorrt", "nemo"],
};

/**
 * Detecta el topic principal por keywords en título y contenido
 */
function detectTopic(title: string, content: string): string | undefined {
  const text = `${title} ${content}`.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return topic;
    }
  }
  return "general-ai";
}

/**
 * Extrae imagen del contenido HTML si existe
 */
function extractImageUrl(content: string): string | undefined {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1];
}

/**
 * Transforma un RawFeedItem de un medio de noticias a NewsArticle
 */
export function transformRssToNews(
  item: RawFeedItem,
  source: RssSource
): NewsArticle | null {
  if (!item.title || !item.link) return null;

  const content = item.content || item.description || "";
  const plainText = content.replace(/<[^>]+>/g, "").trim();
  const summary = (plainText || item.title).slice(0, 300);

  const topic = detectTopic(item.title, plainText);
  const imageUrl = extractImageUrl(content) || (item.enclosure as string | undefined);

  // Extraer autor si está disponible
  const author =
    (item["dc:creator"] as string) ||
    (item.author as string) ||
    (item.creator as string) ||
    undefined;

  return {
    id: `news-${source.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sourceId: source.id,
    title: item.title,
    summary,
    content: plainText.slice(0, 3000),
    author,
    sourceUrl: item.link,
    sourceName: source.name,
    topic,
    tags: topic ? [topic] : [],
    imageUrl,
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
  };
}
