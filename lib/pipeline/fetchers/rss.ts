/**
 * Fetcher para fuentes RSS/Atom
 */

import Parser from "rss-parser";
import type { RssSource } from "@/types/sources";
import type { RawFetchResult, RawFeedItem } from "@/types/sources";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "MainBranch/1.0 (+https://github.com/main-branch)",
  },
});

/**
 * Obtiene y parsea un feed RSS
 */
export async function fetchRss(source: RssSource): Promise<RawFetchResult> {
  const startTime = Date.now();

  try {
    const feed = await parser.parseURL(source.url);
    const items: RawFeedItem[] = (feed.items || []).map((item) => ({
      title: item.title || "",
      link: item.link,
      pubDate: item.pubDate || item.isoDate,
      content: item.content,
      description: item.contentSnippet || item.content,
    }));

    return {
      sourceId: source.id,
      sourceType: "rss",
      items,
      fetchedAt: new Date(),
      success: true,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido al fetch RSS";

    return {
      sourceId: source.id,
      sourceType: "rss",
      items: [],
      fetchedAt: new Date(),
      success: false,
      error: message,
    };
  }
}
