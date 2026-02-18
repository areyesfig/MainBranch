/**
 * POST /api/releases/[id]/vote
 *
 * Incrementa en 1 los votos de un release.
 * Rate limit: 1 voto por IP por release cada 24 horas.
 */

import { NextRequest } from "next/server";
import { incrementVotes } from "@/lib/db/releases";

// Map<`${ip}:${id}`, resetTimestamp>
const voteHits = new Map<string, number>();
const VOTE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

function isRateLimited(ip: string, id: string): boolean {
  const key = `${ip}:${id}`;
  const reset = voteHits.get(key);
  if (reset && Date.now() < reset) return true;
  voteHits.set(key, Date.now() + VOTE_WINDOW_MS);
  return false;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !/^[a-z0-9]+$/.test(id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip, id)) {
    return Response.json(
      { error: "Ya votaste por este release. Vuelve mañana." },
      { status: 429 }
    );
  }

  try {
    const votes = await incrementVotes(id);
    return Response.json({ votes });
  } catch {
    return Response.json({ error: "Release no encontrado" }, { status: 404 });
  }
}
