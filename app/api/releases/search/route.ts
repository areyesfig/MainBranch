/**
 * GET /api/releases/search?q=react&cursor=xxx&limit=20
 *
 * Búsqueda server-side con paginación cursor-based.
 * Busca en technology, version, tldr, description y tags.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const cursor = searchParams.get("cursor");
  const limitParam = parseInt(searchParams.get("limit") ?? "", 10);
  const limit = Math.min(
    Number.isFinite(limitParam) && limitParam > 0 ? limitParam : DEFAULT_LIMIT,
    MAX_LIMIT
  );

  const where = q
    ? {
        OR: [
          { technology: { contains: q, mode: "insensitive" as const } },
          { version: { contains: q, mode: "insensitive" as const } },
          { tldr: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
          { tags: { contains: q, mode: "insensitive" as const } },
          { category: { contains: q, mode: "insensitive" as const } },
          { stack: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const releases = await prisma.release.findMany({
    where,
    orderBy: { releaseDate: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = releases.length > limit;
  const items = hasMore ? releases.slice(0, limit) : releases;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return Response.json({
    items: items.map((r) => ({
      id: r.id,
      technology: r.technology,
      version: r.version,
      releaseDate: r.releaseDate,
      tldr: r.tldr,
      breakingChange: r.breakingChange,
      stack: r.stack,
      category: r.category,
      impactScore: r.impactScore,
      officialUrl: r.officialUrl,
    })),
    nextCursor,
    hasMore,
  });
}
