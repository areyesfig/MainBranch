/**
 * Fetcher para fuentes API (GitHub, npm, etc.)
 */

import type { ApiSource } from "@/types/sources";
import type { RawFetchResult, RawFeedItem } from "@/types/sources";

/**
 * Obtiene datos de una API REST
 */
export async function fetchApi(source: ApiSource): Promise<RawFetchResult> {

  try {
    const response = await fetch(source.url, {
      method: source.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...source.headers,
      },
      cache: "no-store" as RequestCache,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Extraer items según dataPath (ej: data.releases para GitHub)
    let rawItems: unknown[] = [];
    if (source.dataPath) {
      const path = source.dataPath.split(".");
      let current: unknown = data;
      for (const key of path) {
        current = (current as Record<string, unknown>)?.[key];
      }
      rawItems = Array.isArray(current) ? current : [];
    } else if (Array.isArray(data)) {
      rawItems = data;
    } else if (typeof data === "object") {
      rawItems = Object.values(data).flat().filter(Array.isArray).flat() || [data];
    }

    // Normalizar a RawFeedItem según el tipo de API
    const items: RawFeedItem[] = rawItems.map((item: unknown) => {
      const obj = item as Record<string, unknown>;
      return normalizeApiItem(obj, source);
    });

    return {
      sourceId: source.id,
      sourceType: "api",
      items,
      fetchedAt: new Date(),
      success: true,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido al fetch API";

    return {
      sourceId: source.id,
      sourceType: "api",
      items: [],
      fetchedAt: new Date(),
      success: false,
      error: message,
    };
  }
}

/**
 * Normaliza items de diferentes APIs a formato RawFeedItem
 */
function normalizeApiItem(
  obj: Record<string, unknown>,
  source: ApiSource
): RawFeedItem {
  // GitHub Releases format
  if (obj.tag_name && obj.name) {
    return {
      title: (obj.name as string) || (obj.tag_name as string),
      link: obj.html_url as string,
      pubDate: obj.published_at as string,
      content: obj.body as string,
      description: (obj.body as string)?.slice(0, 500),
    };
  }

  // Node.js dist format
  if (obj.version && source.technology === "Node.js") {
    return {
      title: `Node.js ${obj.version}`,
      link: `https://nodejs.org/dist/v${(obj.version as string).replace("v", "")}/`,
      pubDate: obj.date as string,
    };
  }

  // Generic format
  return {
    title: (obj.title || obj.name || obj.version || "Sin título") as string,
    link: (obj.link || obj.url || obj.html_url) as string,
    pubDate: (obj.pubDate || obj.published_at || obj.date || obj.created_at) as string,
    content: (obj.body || obj.content || obj.description) as string,
    description: (obj.description || obj.body) as string,
    ...obj,
  };
}
