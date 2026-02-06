/**
 * Fetcher para fuentes RSS/Atom
 */

import Parser from "rss-parser";
import type { DataSource, RssSource, RawFetchResult, RawFeedItem } from "@/types/sources";
import type { BaseFetcher } from "./BaseFetcher";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "MainBranch/1.0 (+https://github.com/main-branch)",
  },
});

export class RssFetcher implements BaseFetcher {
  async fetch(source: DataSource): Promise<RawFetchResult> {
    if (source.type !== "rss") {
      return {
        sourceId: source.id,
        sourceType: "rss",
        items: [],
        fetchedAt: new Date(),
        success: false,
        error: `RssFetcher no soporta fuente tipo ${source.type}`,
      };
    }
    const rssSource = source as RssSource;
    try {
      const feed = await parser.parseURL(rssSource.url);
      const items: RawFeedItem[] = (feed.items || []).map((item) => ({
        title: item.title || "",
        link: item.link,
        pubDate: item.pubDate || item.isoDate,
        content: item.content,
        description: item.contentSnippet || item.content,
      }));

      return {
        sourceId: rssSource.id,
        sourceType: "rss",
        items,
        fetchedAt: new Date(),
        success: true,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido al fetch RSS";

      return {
        sourceId: rssSource.id,
        sourceType: "rss",
        items: [],
        fetchedAt: new Date(),
        success: false,
        error: message,
      };
    }
  }
}
