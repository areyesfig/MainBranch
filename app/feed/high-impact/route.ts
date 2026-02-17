import { getReleasesSortedByImpact } from "@/lib/data/releases";
import { buildFeedXml, FEED_HEADERS } from "@/lib/feed/buildFeed";

export const dynamic = "force-dynamic";

const HIGH_IMPACT_THRESHOLD = 70;

export async function GET() {
  const allReleases = await getReleasesSortedByImpact();
  const releases = allReleases.filter(
    (r) => (r.impactScore ?? 0) >= HIGH_IMPACT_THRESHOLD
  );

  const xml = buildFeedXml({
    title: "Main Branch — Alto Impacto",
    description: `Solo los releases más relevantes del ecosistema tech (impactScore ≥ ${HIGH_IMPACT_THRESHOLD}/100).`,
    selfUrl: "/feed/high-impact",
    releases,
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
