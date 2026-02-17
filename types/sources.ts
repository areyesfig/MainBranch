/**
 * Tipos para el sistema de fuentes y pipelines de datos
 */

import type { ReleaseNote } from "./release";

/**
 * Tipo de fuente de datos
 */
export type SourceType = "rss" | "api" | "scraping";

/**
 * Estado de una fuente
 */
export type SourceStatus = "active" | "paused" | "error";

/**
 * Configuración base de una fuente
 */
export interface BaseSource {
  id: string;
  name: string;
  type: SourceType;
  technology: string;
  stack?: string;
  category?: string;
  status?: SourceStatus;
  enabled?: boolean;
  /** Paquete npm asociado (para calcular popularidad) */
  npmPackage?: string;
  /** Intervalo mínimo entre fetches (minutos) */
  fetchInterval?: number;
  /** Última vez que se ejecutó */
  lastFetchedAt?: Date;
}

/**
 * Fuente RSS - blogs oficiales, changelogs en formato RSS/Atom
 */
export interface RssSource extends BaseSource {
  type: "rss";
  url: string;
  /** Patrón regex para extraer versión del título */
  versionPattern?: RegExp;
  /** Mapeo de tecnología si el nombre del feed difiere */
  technologyMapping?: Record<string, string>;
}

/**
 * Fuente API - GitHub Releases, npm, etc.
 */
export interface ApiSource extends BaseSource {
  type: "api";
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  /** Path para extraer items (ej: "releases" para GitHub) */
  dataPath?: string;
  /** Paginación */
  pagination?: {
    type: "cursor" | "offset" | "page";
    param?: string;
    limitParam?: string;
    limit?: number;
  };
}

/**
 * Fuente Scraping - para sitios sin API/RSS
 * Especificación: requiere implementación externa (Puppeteer, Playwright, etc.)
 */
export interface ScrapingSource extends BaseSource {
  type: "scraping";
  url: string;
  /** Selectores CSS para extraer datos */
  selectors?: {
    items: string;
    title?: string;
    date?: string;
    link?: string;
    content?: string;
  };
  /** Estrategia: 'static' (fetch+parse) | 'dynamic' (browser) */
  strategy?: "static" | "dynamic";
}

export type DataSource = RssSource | ApiSource | ScrapingSource;

/**
 * Resultado crudo de un fetch
 */
export interface RawFetchResult {
  sourceId: string;
  sourceType: SourceType;
  items: RawFeedItem[];
  fetchedAt: Date;
  success: boolean;
  error?: string;
}

/**
 * Item crudo antes de transformar a ReleaseNote
 */
export interface RawFeedItem {
  title: string;
  link?: string;
  pubDate?: string;
  content?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Resultado del pipeline
 */
export interface PipelineResult {
  sourceId: string;
  releases: ReleaseNote[];
  rawCount: number;
  transformedCount: number;
  errors: string[];
  duration: number;
}
