/**
 * API Route para ejecutar el pipeline de sincronización
 *
 * GET /api/sync - Ejecuta fetch de todas las fuentes y persiste en BD
 * GET /api/sync?source=nextjs-blog - Ejecuta solo una fuente
 *
 * En Vercel: protegido por CRON_SECRET (Bearer token en Authorization header)
 * En local: sin CRON_SECRET permite requests para desarrollo
 *
 * Rate limit: 1 request cada 5 minutos (por IP).
 */

import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { runFullPipeline, runPipelineForSource } from "@/lib/pipeline";
import { getActiveSources } from "@/lib/sources/config";
import { invalidateReleasesCache } from "@/lib/data/releases";
import { deleteOldReleases, getHighImpactReleasesToTweet } from "@/lib/db/releases";
import { tweetHighImpactReleases } from "@/lib/bot/twitter";

export const dynamic = "force-dynamic";

/* ── Rate limiter en memoria (1 req / 5 min por IP) ── */
const SYNC_WINDOW_MS = 5 * 60 * 1000;
const SYNC_MAX = 1;
const syncHits = new Map<string, { count: number; reset: number }>();

function isSyncRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = syncHits.get(ip);
  if (!entry || now > entry.reset) {
    syncHits.set(ip, { count: 1, reset: now + SYNC_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > SYNC_MAX;
}

/** Limpia el rate limiter (para tests). */
export function _resetSyncRateLimit() {
  syncHits.clear();
}

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // Solo permitir sin secret en desarrollo local
    return process.env.NODE_ENV !== "production";
  }
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  // Comparación timing-safe para evitar ataques de timing
  try {
    const secretBuf = Buffer.from(cronSecret, "utf8");
    const tokenBuf = Buffer.from(token, "utf8");
    if (secretBuf.length !== tokenBuf.length) {
      // Comparar contra sí mismo para no filtrar diferencia de longitud por timing
      timingSafeEqual(secretBuf, secretBuf);
      return false;
    }
    return timingSafeEqual(secretBuf, tokenBuf);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  /* ── Rate limit ── */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isSyncRateLimited(ip)) {
    return Response.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("source");

  // Validar formato del sourceId
  if (sourceId && (sourceId.length > 50 || !/^[a-z0-9-]+$/.test(sourceId))) {
    return Response.json({ error: "Parámetro source inválido" }, { status: 400 });
  }

  try {
    if (sourceId) {
      const sources = getActiveSources();
      const source = sources.find((s) => s.id === sourceId);
      if (!source) {
        return Response.json(
          { error: "Fuente no encontrada" },
          { status: 404 }
        );
      }
      const result = await runPipelineForSource(source);
      invalidateReleasesCache();
      return Response.json({
        success: result.errors.length === 0,
        sourceId: result.sourceId,
        releasesCount: result.transformedCount,
        errors: result.errors,
      });
    }

    const { results, allReleases } = await runFullPipeline();

    const deletedCount = await deleteOldReleases(180);
    if (deletedCount > 0) {
      console.log(`[sync] Limpieza: ${deletedCount} releases eliminados (>180 días)`);
    }

    const highImpact = await getHighImpactReleasesToTweet();
    const tweetedCount = await tweetHighImpactReleases(highImpact);

    invalidateReleasesCache();

    return Response.json({
      success: true,
      totalReleases: allReleases.length,
      sourcesProcessed: results.length,
      deletedOldReleases: deletedCount,
      tweetedReleases: tweetedCount,
      results: results.map((r) => ({
        sourceId: r.sourceId,
        releasesCount: r.transformedCount,
        success: r.errors.length === 0,
        errors: r.errors,
      })),
    });
  } catch (error) {
    console.error("Error en sincronización:", error);
    return Response.json(
      { error: "Error en sincronización", success: false },
      { status: 500 }
    );
  }
}
