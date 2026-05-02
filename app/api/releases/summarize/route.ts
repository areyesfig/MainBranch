/**
 * POST /api/releases/summarize
 * Body: { releaseId: string }
 *
 * Genera y persiste en DB un resumen editorial estructurado para un release.
 * Requiere ANTHROPIC_API_KEY.
 * Requiere cabecera Authorization: Bearer <CRON_SECRET> en producción.
 */

import { NextRequest } from "next/server";
import { getReleaseById } from "@/lib/data/releases";
import { updateReleaseAiSummary } from "@/lib/db/releases";
import { summarizeReleaseWithAI } from "@/lib/ai/summarizeRelease";
import { shouldGenerateSummary } from "@/lib/feed/shouldGenerateSummary";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function isAuthorized(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY no configurada" },
      { status: 503 }
    );
  }

  let body: { releaseId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { releaseId } = body;
  if (!releaseId || typeof releaseId !== "string") {
    return Response.json({ error: "releaseId es requerido" }, { status: 400 });
  }

  const release = await getReleaseById(releaseId);
  if (!release) {
    return Response.json({ error: "Release no encontrado" }, { status: 404 });
  }

  if (!shouldGenerateSummary(release)) {
    return Response.json({ skipped: true, reason: "No cumple criterios de filtro" });
  }

  // Skip if already generated
  if (release.aiSummary) {
    return Response.json({ skipped: true, reason: "Ya tiene resumen", summary: release.aiSummary });
  }

  try {
    const summary = await summarizeReleaseWithAI(release, apiKey);

    if (!summary) {
      return Response.json({ skipped: true, reason: "IA decidió no generar resumen" });
    }

    await updateReleaseAiSummary(releaseId, summary);
    return Response.json({ ok: true, summary });
  } catch (error) {
    console.error("[summarize]", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Error al generar resumen" },
      { status: 502 }
    );
  }
}
