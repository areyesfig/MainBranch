/**
 * GET /api/health — Diagnóstico de BD y pipeline
 * Protegido por CRON_SECRET en producción.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Misma auth que /api/sync
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (token !== cronSecret) {
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
      NODE_ENV: process.env.NODE_ENV,
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
