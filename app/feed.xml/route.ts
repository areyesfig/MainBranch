import { getReleases } from "@/lib/data/releases";
import { buildFeedXml, FEED_HEADERS } from "@/lib/feed/buildFeed";

export const dynamic = "force-dynamic";

export async function GET() {
  const releases = await getReleases();

  const xml = buildFeedXml({
    title: "Main Branch — Todos los Releases",
    description:
      "Las últimas versiones y actualizaciones de tecnologías: React, Next.js, Node.js, Rust y más.",
    selfUrl: "/feed.xml",
    releases,
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
