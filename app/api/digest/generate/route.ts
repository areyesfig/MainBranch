/**
 * POST /api/digest/generate — Genera un digest con periodo específico
 *   Body: { period: "weekly" | "monthly", force?: boolean }
 *
 * GET /api/digest/generate — Para Vercel Cron. Genera weekly los lunes,
 *   monthly el día 1. Protegido por CRON_SECRET.
 */

import { NextRequest } from "next/server";
import { digestPeriodSchema, type DigestPeriod } from "@/lib/schemas/digest";
import { getReleasesInRange } from "@/lib/db/releases";
import { upsertDigest } from "@/lib/db/digests";
import { generateDigestWithAI } from "@/lib/ai/generateDigest";
import { getWeeklyRange, getMonthlyRange } from "@/lib/utils/dateRanges";
import { isAuthorized } from "@/lib/auth/isAuthorized";

export const dynamic = "force-dynamic";

async function generateForPeriod(
  period: DigestPeriod,
  apiKey: string,
  force = false,
  ref?: Date
) {
  const refDate = ref ?? new Date();
  const { startDate, endDate } =
    period === "weekly" ? getWeeklyRange(refDate) : getMonthlyRange(refDate);

  const releases = await getReleasesInRange(startDate, endDate);

  if (releases.length === 0 && !force) {
    return {
      success: false,
      message: "No hay releases en el período",
      period,
      startDate,
      endDate,
    };
  }

  const technologies = [...new Set(releases.map((r) => r.technology))];

  const content =
    releases.length > 0
      ? await generateDigestWithAI(releases, period, startDate, endDate, apiKey)
      : `No se encontraron releases para el período.`;

  const digest = await upsertDigest({
    period,
    startDate,
    endDate,
    content,
    technologies,
    releaseCount: releases.length,
  });

  return {
    success: true,
    digest: {
      id: digest.id,
      period: digest.period,
      releaseCount: digest.releaseCount,
      technologies: digest.technologies,
    },
  };
}

/**
 * GET — Para Vercel Cron. Genera weekly los lunes, monthly el día 1.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY no configurada" },
      { status: 500 }
    );
  }

  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate();
    const results: Record<string, unknown>[] = [];

    if (dayOfWeek === 1) {
      results.push(await generateForPeriod("weekly", apiKey));
    }
    if (dayOfMonth === 1) {
      results.push(await generateForPeriod("monthly", apiKey));
    }

    if (results.length === 0) {
      return Response.json({
        success: true,
        message: "No hay digests para generar hoy",
      });
    }

    return Response.json({ success: true, results });
  } catch (error) {
    console.error("Error generando digest (cron):", error);
    return Response.json(
      {
        error: "Error generando digest",
        message: process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Error interno",
      },
      { status: 500 }
    );
  }
}

/**
 * POST — Genera un digest para un periodo específico.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY no configurada" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const parsed = digestPeriodSchema.safeParse(
    (body as { period?: unknown })?.period
  );
  if (!parsed.success) {
    return Response.json(
      { error: "period debe ser 'weekly' o 'monthly'" },
      { status: 400 }
    );
  }

  const period = parsed.data;
  const force = (body as { force?: boolean })?.force === true;
  const refStr = (body as { ref?: string })?.ref;
  const ref = refStr ? new Date(refStr) : undefined;
  if (ref && isNaN(ref.getTime())) {
    return Response.json(
      { error: "ref debe ser una fecha ISO válida" },
      { status: 400 }
    );
  }

  try {
    const result = await generateForPeriod(period, apiKey, force, ref);
    return Response.json(result);
  } catch (error) {
    console.error("Error generando digest:", error);
    return Response.json(
      {
        error: "Error generando digest",
        message: process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Error interno",
      },
      { status: 500 }
    );
  }
}
