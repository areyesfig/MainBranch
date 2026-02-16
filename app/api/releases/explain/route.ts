/**
 * POST /api/releases/explain
 * Body: { releaseId: string }
 * Genera una explicación en lenguaje claro del release usando IA (OpenAI).
 * Requiere OPENAI_API_KEY en el entorno.
 *
 * Rate limit: máximo 10 requests por IP cada 15 minutos.
 */

import { NextRequest } from "next/server";
import { getReleaseById } from "@/lib/data/releases";
import { explainReleaseWithAI } from "@/lib/ai/explainRelease";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/* ── Rate limiter en memoria (por IP, 10 req / 15 min) ── */
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 10;
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_MAX;
}

export async function POST(request: NextRequest) {
  /* ── Rate limit ── */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
      { status: 429 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Servicio de explicación IA no disponible." },
      { status: 503 }
    );
  }

  /* ── Validar Content-Type ── */
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return Response.json(
      { error: "Content-Type debe ser application/json" },
      { status: 415 }
    );
  }

  let body: { releaseId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Cuerpo JSON inválido. Se espera { releaseId: string }." },
      { status: 400 }
    );
  }

  const releaseId = body.releaseId;
  if (!releaseId || typeof releaseId !== "string" || releaseId.length > 200) {
    return Response.json(
      { error: "releaseId es requerido" },
      { status: 400 }
    );
  }

  const release = await getReleaseById(releaseId);
  if (!release) {
    return Response.json(
      { error: "Release no encontrado" },
      { status: 404 }
    );
  }

  try {
    const explanation = await explainReleaseWithAI(release, apiKey);
    return Response.json({ explanation });
  } catch (error) {
    console.error("Error al generar explicación IA:", error);
    return Response.json(
      { error: "No se pudo generar la explicación. Intenta de nuevo más tarde." },
      { status: 502 }
    );
  }
}
