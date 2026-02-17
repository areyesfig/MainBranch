/**
 * GET /api/health — Diagnóstico de BD y pipeline
 * Protegido por CRON_SECRET en producción.
 */

import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization") ?? "";
    // Extracción segura del token con regex
    const token = authHeader.match(/^Bearer\s+(\S+)$/)?.[1] ?? "";
    try {
      const secretBuf = Buffer.from(cronSecret, "utf8");
      const tokenBuf = Buffer.from(token, "utf8");
      // Comparación en tiempo constante para prevenir timing attacks
      if (secretBuf.length !== tokenBuf.length) {
        timingSafeEqual(secretBuf, secretBuf); // dummy para timing uniforme
        return Response.json({ error: "No autorizado" }, { status: 401 });
      }
      if (!timingSafeEqual(secretBuf, tokenBuf)) {
        return Response.json({ error: "No autorizado" }, { status: 401 });
      }
    } catch {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const checks: Record<string, unknown> = {
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      CRON_SECRET: !!process.env.CRON_SECRET,
      GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
      REDIS_URL: !!process.env.REDIS_URL,
      // NODE_ENV omitido: no exponer información del entorno
    },
  };

  // Test BD
  try {
    const count = await prisma.release.count();
    const latest = await prisma.release.findFirst({
      orderBy: { createdAt: "desc" },
      select: {
        technology: true,
        version: true,
        releaseDate: true,
        createdAt: true,
        sourceId: true,
      },
    });
    checks.db = { connected: true, releaseCount: count, latestRelease: latest };
  } catch (error) {
    checks.db = {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  return Response.json(checks);
}
