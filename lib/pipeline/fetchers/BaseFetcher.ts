/**
 * Interfaz base para fetchers del pipeline.
 * Cada implementación (RSS, API, etc.) obtiene datos crudos de una fuente.
 */

import type { DataSource, RawFetchResult } from "@/types/sources";

export interface BaseFetcher {
  /**
   * Obtiene los items crudos de la fuente.
   * @param source - Configuración de la fuente (debe coincidir con el tipo del fetcher)
   */
  fetch(source: DataSource): Promise<RawFetchResult>;
}
