import type { ReleaseNote } from "@/types/release";

function safeBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || "https://mainbranch.dev";
  try {
    const url = new URL(raw);
    // Solo aceptar https (o http en desarrollo)
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "https://mainbranch.dev";
    }
    return raw.replace(/\/$/, ""); // quitar trailing slash
  } catch {
    return "https://mainbranch.dev";
  }
}

const BASE_URL = safeBaseUrl();

function isValidHttpUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface FeedOptions {
  title: string;
  description: string;
  selfUrl: string;
  releases: ReleaseNote[];
}

export function buildFeedXml({
  title,
  description,
  selfUrl,
  releases,
}: FeedOptions): string {
  const lastBuildDate = new Date().toUTCString();
  const fullSelfUrl = `${BASE_URL}${selfUrl}`;

  const items = releases
    .slice(0, 50)
    .map((r) => {
      const pubDate = new Date(r.releaseDate).toUTCString();
      const link =
        (r.officialUrl && isValidHttpUrl(r.officialUrl))
          ? r.officialUrl
          : `${BASE_URL}/releases/${r.id}`;
      const itemTitle = escapeXml(`${r.technology} ${r.version}`);
      const desc = escapeXml(r.tldr || r.description);
      const categories = [
        r.breakingChange ? "    <category>Breaking Change</category>" : "",
        r.category ? `    <category>${escapeXml(r.category)}</category>` : "",
      ]
        .filter(Boolean)
        .join("\n");

      return `    <item>
      <title>${itemTitle}</title>
      <link>${escapeXml(link)}</link>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${r.id}</guid>
${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(description)}</description>
    <language>es</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(fullSelfUrl)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

export const FEED_HEADERS = {
  "Content-Type": "application/rss+xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};
