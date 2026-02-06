/**
 * API Route para ejecutar el pipeline de sincronización
 *
 * GET /api/sync - Ejecuta fetch de todas las fuentes y persiste en BD
 * GET /api/sync?source=nextjs-blog - Ejecuta solo una fuente
 *
 * En Vercel: protegido por CRON_SECRET (Bearer token en Authorization header)
 * En local: sin CRON_SECRET permite requests para desarrollo
 */

import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { runFullPipeline, runPipelineForSource } from "@/lib/pipeline";
import { getActiveSources } from "@/lib/sources/config";
import { invalidateReleasesCache } from "@/lib/data/releases";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // Sin secret = permitir (desarrollo local)
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  // Comparación timing-safe para evitar ataques de timing
  try {
    const secretBuf = Buffer.from(cronSecret, "utf8");
    const tokenBuf = Buffer.from(token, "utf8");
    if (secretBuf.length !== tokenBuf.length) return false;
    return timingSafeEqual(secretBuf, tokenBuf);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("source");

  try {
    if (sourceId) {
      const sources = getActiveSources();
      const source = sources.find((s) => s.id === sourceId);
      if (!source) {
        return Response.json(
          { error: `Fuente no encontrada: ${sourceId}` },
          { status: 404 }
        );
      }
      const result = await runPipelineForSource(source);
      return Response.json(result);
    }

    const { results, allReleases, totalDuration } = await runFullPipeline();

    invalidateReleasesCache();

    return Response.json({
      success: true,
      totalReleases: allReleases.length,
      totalDuration,
      sourcesProcessed: results.length,
      results: results.map((r) => ({
        sourceId: r.sourceId,
        releasesCount: r.transformedCount,
        rawCount: r.rawCount,
        errors: r.errors,
        duration: r.duration,
      })),
      releases: allReleases.slice(0, 50), // Limitar respuesta
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error en sincronización";
    return Response.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}
