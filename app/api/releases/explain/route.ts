/**
 * POST /api/releases/explain
 * Body: { releaseId: string }
 * Genera una explicación en lenguaje claro del release usando IA (OpenAI).
 * Requiere OPENAI_API_KEY en el entorno.
 *
 * Protecciones:
 * - Rate limit por IP: 10 requests cada 15 minutos.
 * - Límite global diario: 200 requests por día (para controlar costos).
 * - Caché en memoria: una vez generada la explicación de un release, se reutiliza.
 */

import { NextRequest } from "next/server";
import { getReleaseById } from "@/lib/data/releases";
import { explainReleaseWithAI } from "@/lib/ai/explainRelease";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/* ── Rate limiter por IP (10 req / 15 min) ── */
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

/* ── Límite global diario (200 req / día) ── */
const DAILY_MAX = 200;
let dailyCount = 0;
let dailyReset = Date.now() + 24 * 60 * 60 * 1000;

function isDailyLimitReached(): boolean {
  const now = Date.now();
  if (now > dailyReset) {
    dailyCount = 0;
    dailyReset = now + 24 * 60 * 60 * 1000;
  }
  return dailyCount >= DAILY_MAX;
}

function incrementDailyCount() {
  dailyCount++;
}

/* ── Caché de explicaciones (releaseId → texto) ── */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas
const explanationCache = new Map<string, { text: string; expiresAt: number }>();

function getCachedExplanation(releaseId: string): string | null {
  const entry = explanationCache.get(releaseId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    explanationCache.delete(releaseId);
    return null;
  }
  return entry.text;
}

function cacheExplanation(releaseId: string, text: string) {
  explanationCache.set(releaseId, { text, expiresAt: Date.now() + CACHE_TTL_MS });
}

export async function POST(request: NextRequest) {
  /* ── Rate limit por IP ── */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
      { status: 429 }
    );
  }

  /* ── Límite global diario ── */
  if (isDailyLimitReached()) {
    return Response.json(
      { error: "Se alcanzó el límite diario de explicaciones. Intenta mañana." },
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

  /* ── Caché: devolver si ya existe ── */
  const cached = getCachedExplanation(releaseId);
  if (cached) {
    return Response.json({ explanation: cached });
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
    cacheExplanation(releaseId, explanation);
    incrementDailyCount();
    return Response.json({ explanation });
  } catch (error) {
    console.error("Error al generar explicación IA:", error);
    return Response.json(
      { error: "No se pudo generar la explicación. Intenta de nuevo más tarde." },
      { status: 502 }
    );
  }
}
