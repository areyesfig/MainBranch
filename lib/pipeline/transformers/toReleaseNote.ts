/**
 * Transforma items crudos a ReleaseNote
 */

import type { ReleaseNote } from "@/types/release";
import type { RawFeedItem } from "@/types/sources";
import type { RssSource, ApiSource } from "@/types/sources";

/**
 * Extrae versión del título usando patrón regex
 */
function extractVersion(
  title: string,
  pattern?: RegExp | string
): string {
  if (pattern) {
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    const match = title.match(regex);
    return match ? match[1] : "0.0.0";
  }
  // Patrón por defecto: números separados por puntos
  const defaultMatch = title.match(/(\d+\.\d+(?:\.\d+)?)/);
  return defaultMatch ? defaultMatch[1] : "0.0.0";
}

/**
 * Determina si el release incluye breaking changes (heurística)
 */
function detectBreakingChange(title: string, content?: string): boolean {
  const text = `${title} ${content || ""}`.toLowerCase();
  const breakingKeywords = [
    "breaking",
    "breaking change",
    "major release",
    "v2",
    "v3",
    "2.0",
    "3.0",
  ];
  return breakingKeywords.some((kw) => text.includes(kw));
}

/**
 * Transforma un RawFeedItem a ReleaseNote (fuente RSS)
 */
export function transformRssItem(
  item: RawFeedItem,
  source: RssSource,
  index: number
): ReleaseNote {
  const version = extractVersion(item.title, source.versionPattern);
  const content = item.content || item.description || "";

  return {
    id: `rss-${source.id}-${index}-${Date.now()}`,
    technology: source.technology,
    version,
    releaseDate: item.pubDate ? new Date(item.pubDate) : new Date(),
    tldr: (item.description || content?.slice(0, 300) || item.title).slice(0, 300),
    description: content.slice(0, 1500) || item.title,
    breakingChange: detectBreakingChange(item.title, content),
    officialUrl: item.link,
    tags: [source.category || "tech"].filter(Boolean),
    stack: source.stack,
    category: source.category,
  };
}

/**
 * Transforma un RawFeedItem a ReleaseNote (fuente API)
 */
export function transformApiItem(
  item: RawFeedItem,
  source: ApiSource,
  index: number
): ReleaseNote {
  const version = extractVersion(item.title);
  const content = item.content || item.description || "";

  return {
    id: `api-${source.id}-${index}-${Date.now()}`,
    technology: source.technology,
    version,
    releaseDate: item.pubDate ? new Date(item.pubDate) : new Date(),
    tldr: (item.description || content?.slice(0, 300) || item.title).slice(0, 300),
    description: content.slice(0, 1500) || item.title,
    breakingChange: detectBreakingChange(item.title, content),
    officialUrl: item.link,
    tags: [source.category || "tech"].filter(Boolean),
    stack: source.stack,
    category: source.category,
  };
}
