import { getReleasesByStack } from "@/lib/data/releases";
import { buildFeedXml, FEED_HEADERS } from "@/lib/feed/buildFeed";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ technology: string }> }
) {
  const { technology } = await params;

  // Solo permitir slugs válidos: letras, números, guiones, puntos
  if (!/^[a-z0-9._-]+$/i.test(technology)) {
    return new Response("Invalid technology slug", { status: 400 });
  }

  const releases = await getReleasesByStack(technology);

  if (releases.length === 0) {
    return new Response(
      `No se encontraron releases para: ${technology}`,
      { status: 404 }
    );
  }

  const displayName = releases[0]?.technology ?? technology;

  const xml = buildFeedXml({
    title: `Main Branch — ${displayName}`,
    description: `Últimas versiones y actualizaciones de ${displayName}.`,
    selfUrl: `/feed/${technology}`,
    releases,
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
