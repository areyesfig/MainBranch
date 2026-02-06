import { NextRequest } from "next/server";
import { getReleases, getReleasesByCategory, getReleasesByStack } from "@/lib/data/releases";

/**
 * Genera un feed RSS personalizado por stack o categoría
 * Uso: /feed - todos los releases
 *      /feed?stack=nextjs - solo releases de Next.js
 *      /feed?stack=react,typescript - múltiples stacks
 *      /feed?category=ai-ml - solo releases de IA/ML
 *      /feed?category=llms - solo releases de LLMs
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stackParam = searchParams.get("stack");
  const categoryParam = searchParams.get("category");

  let releases = await getReleases();
  if (categoryParam) {
    releases = await getReleasesByCategory(categoryParam);
  }
  if (stackParam) {
    const stacks = stackParam.split(",").map((s) => s.trim());
    if (stacks.length === 1) {
      releases = releases.filter((r) => r.stack === stacks[0]);
    } else {
      releases = releases.filter(
        (r) => r.stack && stacks.includes(r.stack)
      );
    }
  }

  const sortedReleases = [...releases].sort((a, b) => {
    const dateA = new Date(a.releaseDate).getTime();
    const dateB = new Date(b.releaseDate).getTime();
    return dateB - dateA;
  });

  const baseUrl = request.nextUrl.origin;
  const title =
    categoryParam
      ? `Main Branch - ${categoryParam}`
      : stackParam
        ? `Main Branch - ${stackParam}`
        : "Main Branch";
  const description =
    categoryParam
      ? `Últimos lanzamientos de ${categoryParam}`
      : stackParam
        ? `Últimos lanzamientos de ${stackParam}`
        : "Últimos lanzamientos tecnológicos";

  // Construir URL del feed escapando params para evitar inyección XML
  const feedQuery =
    categoryParam
      ? `?category=${encodeURIComponent(categoryParam)}`
      : stackParam
        ? `?stack=${encodeURIComponent(stackParam)}`
        : "";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>es</language>
    <atom:link href="${baseUrl}/feed${feedQuery}" rel="self" type="application/rss+xml"/>
    ${sortedReleases
      .map(
        (release) => `
    <item>
      <title>${escapeXml(release.technology)} ${escapeXml(release.version)}</title>
      <link>${baseUrl}/releases/${release.id}</link>
      <description>${escapeXml(release.tldr)}</description>
      <pubDate>${new Date(release.releaseDate).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/releases/${release.id}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
