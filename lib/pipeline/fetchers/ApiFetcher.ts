/**
 * Fetcher para fuentes API (GitHub, npm, etc.)
 */

import type { ApiSource, DataSource, RawFetchResult, RawFeedItem } from "@/types/sources";
import type { BaseFetcher } from "./BaseFetcher";
import { isAllowedUrl } from "./urlValidator";

const MAX_RESPONSE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_DATA_PATH_DEPTH = 10;
const MAX_ITEMS = 15;

function normalizeApiItem(
  obj: Record<string, unknown>,
  source: ApiSource
): RawFeedItem {
  if (obj.tag_name && obj.name) {
    return {
      title: (obj.name as string) || (obj.tag_name as string),
      link: obj.html_url as string,
      pubDate: obj.published_at as string,
      content: obj.body as string,
      description: (obj.body as string)?.slice(0, 500),
    };
  }
  if (obj.version && source.technology === "Node.js") {
    return {
      title: `Node.js ${obj.version}`,
      link: `https://nodejs.org/dist/v${(obj.version as string).replace("v", "")}/`,
      pubDate: obj.date as string,
    };
  }
  return {
    title: (obj.title || obj.name || obj.version || "Sin título") as string,
    link: (obj.link || obj.url || obj.html_url) as string,
    pubDate: (obj.pubDate || obj.published_at || obj.date || obj.created_at) as string,
    content: (obj.body || obj.content || obj.description) as string,
    description: (obj.description || obj.body) as string,
    ...obj,
  };
}

export class ApiFetcher implements BaseFetcher {
  async fetch(source: DataSource): Promise<RawFetchResult> {
    if (source.type !== "api") {
      return {
        sourceId: source.id,
        sourceType: "api",
        items: [],
        fetchedAt: new Date(),
        success: false,
        error: `ApiFetcher no soporta fuente tipo ${source.type}`,
      };
    }

    const apiSource = source as ApiSource;
    try {
      if (!isAllowedUrl(apiSource.url)) {
        throw new Error("URL bloqueada por política de seguridad");
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...apiSource.headers,
      };

      // Inyectar GITHUB_TOKEN para fuentes de GitHub API
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken && apiSource.url.includes("api.github.com")) {
        headers["Authorization"] = `token ${githubToken}`;
      }

      const response = await fetch(apiSource.url, {
        method: apiSource.method || "GET",
        headers,
        signal: AbortSignal.timeout(15000),
        cache: "no-store" as RequestCache,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Validar tamaño de respuesta antes de parsear
      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_BYTES) {
        throw new Error("Respuesta demasiado grande");
      }

      const data = await response.json();
      let rawItems: unknown[] = [];

      if (apiSource.dataPath) {
        const path = apiSource.dataPath.split(".");
        if (path.length > MAX_DATA_PATH_DEPTH) {
          throw new Error("dataPath demasiado profundo");
        }
        let current: unknown = data;
        for (const key of path) {
          current = (current as Record<string, unknown>)?.[key];
        }
        rawItems = Array.isArray(current) ? current : [];
      } else if (Array.isArray(data)) {
        rawItems = data;
      } else if (typeof data === "object" && data !== null) {
        const values = Object.values(data);
        const firstArray = values.find(Array.isArray);
        rawItems = Array.isArray(firstArray) ? firstArray : [data];
      }

      const items: RawFeedItem[] = rawItems
        .slice(0, MAX_ITEMS)
        .map((item: unknown) =>
          normalizeApiItem(item as Record<string, unknown>, apiSource)
        );

      return {
        sourceId: apiSource.id,
        sourceType: "api",
        items,
        fetchedAt: new Date(),
        success: true,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido al fetch API";
      return {
        sourceId: apiSource.id,
        sourceType: "api",
        items: [],
        fetchedAt: new Date(),
        success: false,
        error: message,
      };
    }
  }
}
