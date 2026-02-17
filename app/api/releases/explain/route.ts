/**
 * POST /api/releases/explain
 * Body: { releaseId: string }
 * Genera una explicación en lenguaje claro del release usando IA (OpenAI).
 * Requiere OPENAI_API_KEY en el entorno.
 *
 * Protecciones:
 * - Rate limit por IP: 10 requests cada 15 minutos.
 * - Límite global diario: 200 requests por día (cross-instancia vía Redis).
 * - Caché de explicaciones: Redis (24h) con fallback en memoria.
 */

import { NextRequest } from "next/server";
import { getReleaseById } from "@/lib/data/releases";
import { explainReleaseWithAI } from "@/lib/ai/explainRelease";
import { cacheGet, cacheSet, redisIncr, cacheGetRaw } from "@/lib/cache/redis";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/* ── Rate limiter por IP (10 req / 15 min) — en memoria, por instancia ── */
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

/* ── Límite global diario (200 req / día) — Redis con fallback en memoria ── */
const DAILY_MAX = 200;
let _dailyCount = 0;
let _dailyReset = Date.now() + 24 * 60 * 60 * 1000;

async function isDailyLimitReached(): Promise<boolean> {
  // Intentar Redis primero (cross-instancia)
  const countStr = await cacheGetRaw("mb:explain:daily-count");
  if (countStr !== null) {
    return parseInt(countStr, 10) >= DAILY_MAX;
  }
  // Fallback en memoria (single-instancia)
  const now = Date.now();
  if (now > _dailyReset) {
    _dailyCount = 0;
    _dailyReset = now + 24 * 60 * 60 * 1000;
  }
  return _dailyCount >= DAILY_MAX;
}

async function incrementDailyCount(): Promise<void> {
  const val = await redisIncr("mb:explain:daily-count", 86400);
  if (val === null) _dailyCount++; // fallback en memoria
}

/* ── Caché de explicaciones — Redis (24h) con fallback en memoria ── */
const CACHE_TTL_SECS = 86400; // 24 horas
const _memCache = new Map<string, { text: string; expiresAt: number }>();

async function getCachedExplanation(releaseId: string): Promise<string | null> {
  // Redis primero
  const fromRedis = await cacheGet<string>(`mb:explain:${releaseId}`);
  if (fromRedis !== null) return fromRedis;
  // Fallback memoria
  const entry = _memCache.get(releaseId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    _memCache.delete(releaseId);
    return null;
  }
  return entry.text;
}

async function setCachedExplanation(
  releaseId: string,
  text: string
): Promise<void> {
  await cacheSet(`mb:explain:${releaseId}`, text, CACHE_TTL_SECS);
  // Guardar también en memoria como respaldo
  _memCache.set(releaseId, { text, expiresAt: Date.now() + CACHE_TTL_SECS * 1000 });
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
  if (await isDailyLimitReached()) {
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
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.split(";")[0].trim().includes("application/json")) {
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
  const cached = await getCachedExplanation(releaseId);
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
    await setCachedExplanation(releaseId, explanation);
    await incrementDailyCount();
    return Response.json({ explanation });
  } catch (error) {
    console.error("Error al generar explicación IA:", error);
    return Response.json(
      { error: "No se pudo generar la explicación. Intenta de nuevo más tarde." },
      { status: 502 }
    );
  }
}
