import { getReleases } from "@/lib/data/releases";
import { buildFeedXml, FEED_HEADERS } from "@/lib/feed/buildFeed";

export const dynamic = "force-dynamic";

export async function GET() {
  const allReleases = await getReleases();
  const releases = allReleases.filter((r) => r.breakingChange);

  const xml = buildFeedXml({
    title: "Main Branch — Breaking Changes",
    description:
      "Releases con cambios que rompen compatibilidad (breaking changes). Mantente al día antes de actualizar.",
    selfUrl: "/feed/breaking",
    releases,
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
