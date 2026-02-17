/**
 * GET /api/digest — Lista digests
 * GET /api/digest?period=weekly — Filtra por periodo
 * GET /api/digest?id=xxx — Obtiene un digest específico
 */

import { NextRequest } from "next/server";
import { getDigests, getDigestById } from "@/lib/data/digests";
import { digestPeriodSchema } from "@/lib/schemas/digest";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const periodParam = searchParams.get("period");

  try {
    if (id) {
      if (id.length > 50) {
        return Response.json({ error: "ID inválido" }, { status: 400 });
      }
      const digest = await getDigestById(id);
      if (!digest) {
        return Response.json({ error: "Digest no encontrado" }, { status: 404 });
      }
      return Response.json({ digest });
    }

    let period: "weekly" | "monthly" | undefined;
    if (periodParam) {
      const parsed = digestPeriodSchema.safeParse(periodParam);
      if (!parsed.success) {
        return Response.json(
          { error: "period debe ser 'weekly' o 'monthly'" },
          { status: 400 }
        );
      }
      period = parsed.data;
    }

    const digests = await getDigests(period);
    return Response.json({ digests });
  } catch (error) {
    console.error("Error obteniendo digests:", error);
    return Response.json(
      { error: "Error obteniendo digests" },
      { status: 500 }
    );
  }
}
