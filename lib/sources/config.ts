/**
 * Configuración de fuentes de datos
 * RSS, APIs y especificación para scraping
 */

import type { DataSource, RssSource, ApiSource } from "@/types/sources";

/**
 * Fuentes RSS - blogs oficiales y changelogs
 * Formato: RSS 2.0, Atom
 */
export const RSS_SOURCES: RssSource[] = [
  {
    id: "nextjs-blog",
    name: "Next.js Blog",
    type: "rss",
    url: "https://nextjs.org/feed.xml",
    technology: "Next.js",
    stack: "nextjs",
    category: "frontend",
    enabled: true,
    fetchInterval: 60,
    versionPattern: /(\d+\.\d+\.\d+)/,
  },
  {
    id: "react-blog",
    name: "React Blog",
    type: "rss",
    url: "https://react.dev/feed.xml",
    technology: "React",
    stack: "react",
    category: "frontend",
    enabled: true,
    fetchInterval: 60,
    versionPattern: /(\d+\.\d+\.\d+)/,
  },
  {
    id: "vercel-blog",
    name: "Vercel Blog",
    type: "rss",
    url: "https://vercel.com/blog/feed.xml",
    technology: "Vercel",
    stack: "vercel",
    category: "devops",
    enabled: true,
    fetchInterval: 120,
  },
  {
    id: "github-blog",
    name: "GitHub Blog",
    type: "rss",
    url: "https://github.blog/feed/",
    technology: "GitHub",
    stack: "github",
    category: "tools",
    enabled: true,
    fetchInterval: 60,
  },
  {
    id: "openai-blog",
    name: "OpenAI Blog",
    type: "rss",
    url: "https://openai.com/blog/rss.xml",
    technology: "OpenAI",
    stack: "openai",
    category: "llms",
    enabled: true,
    fetchInterval: 120,
  },
  {
    id: "anthropic-blog",
    name: "Anthropic Blog",
    type: "rss",
    url: "https://www.anthropic.com/news/rss",
    technology: "Anthropic",
    stack: "claude",
    category: "llms",
    enabled: true,
    fetchInterval: 120,
  },
  {
    id: "huggingface-blog",
    name: "Hugging Face Blog",
    type: "rss",
    url: "https://huggingface.co/blog/feed.xml",
    technology: "Hugging Face",
    stack: "huggingface",
    category: "ai-ml",
    enabled: true,
    fetchInterval: 60,
  },
  {
    id: "pytorch-blog",
    name: "PyTorch Blog",
    type: "rss",
    url: "https://pytorch.org/blog/feed.xml",
    technology: "PyTorch",
    stack: "pytorch",
    category: "ai-ml",
    enabled: true,
    fetchInterval: 120,
  },
];

/**
 * Fuentes API - GitHub Releases, npm, etc.
 */
export const API_SOURCES: ApiSource[] = [
  {
    id: "node-releases",
    name: "Node.js Releases",
    type: "api",
    url: "https://nodejs.org/dist/index.json",
    technology: "Node.js",
    stack: "nodejs",
    category: "backend",
    enabled: true,
    fetchInterval: 240,
    dataPath: "", // Array directo
  },
  {
    id: "github-nextjs-releases",
    name: "Next.js GitHub Releases",
    type: "api",
    url: "https://api.github.com/repos/vercel/next.js/releases?per_page=10",
    technology: "Next.js",
    stack: "nextjs",
    category: "frontend",
    enabled: true,
    fetchInterval: 60,
    dataPath: "",
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "TechReleaseNews/1.0",
    },
  },
  {
    id: "github-react-releases",
    name: "React GitHub Releases",
    type: "api",
    url: "https://api.github.com/repos/facebook/react/releases?per_page=10",
    technology: "React",
    stack: "react",
    category: "frontend",
    enabled: true,
    fetchInterval: 60,
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "TechReleaseNews/1.0",
    },
  },
];

/**
 * Especificación de fuentes para Scraping
 * Requiere implementación con Puppeteer/Playwright - solo especificación
 */
export const SCRAPING_SOURCES_SPEC = [
  {
    id: "typescript-release-notes",
    name: "TypeScript Release Notes",
    url: "https://www.typescriptlang.org/docs/handbook/release-notes/overview.html",
    technology: "TypeScript",
    stack: "typescript",
    category: "tools",
    strategy: "static" as const,
    selectors: {
      items: "article h2",
      title: "h2",
      link: "a",
    },
  },
  {
    id: "tailwind-releases",
    name: "Tailwind CSS Releases",
    url: "https://github.com/tailwindlabs/tailwindcss/releases",
    technology: "Tailwind CSS",
    stack: "tailwind",
    category: "frontend",
    strategy: "static" as const,
    note: "GitHub releases page - preferir API si hay rate limit disponible",
  },
];

/**
 * Todas las fuentes activas
 */
export function getActiveSources(): DataSource[] {
  return [
    ...RSS_SOURCES.filter((s) => s.enabled !== false),
    ...API_SOURCES.filter((s) => s.enabled !== false),
  ];
}
