/**
 * Factory para obtener el fetcher adecuado según el tipo de fuente.
 * En api/sync solo se pasa el ID de la fuente; la fuente se resuelve y aquí
 * se obtiene el fetcher que corresponde a su tipo.
 */

import type { DataSource } from "@/types/sources";
import type { BaseFetcher } from "./BaseFetcher";
import { RssFetcher } from "./RssFetcher";
import { ApiFetcher } from "./ApiFetcher";

const rssFetcher = new RssFetcher();
const apiFetcher = new ApiFetcher();

/**
 * Devuelve el fetcher que debe usarse para la fuente dada.
 * @param source - Fuente ya resuelta (p. ej. por ID desde getActiveSources)
 */
export function getFetcher(source: DataSource): BaseFetcher {
  switch (source.type) {
    case "rss":
      return rssFetcher;
    case "api":
      return apiFetcher;
    case "scraping":
      throw new Error("Scraping no implementado - requiere Puppeteer/Playwright");
    default: {
      const _exhaustive: never = source;
      throw new Error(`Tipo de fuente no soportado: ${(_exhaustive as DataSource).type}`);
    }
  }
}
