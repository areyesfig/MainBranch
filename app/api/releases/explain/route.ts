/**
 * POST /api/releases/explain
 * Body: { releaseId: string }
 * Genera una explicación en lenguaje claro del release usando IA (OpenAI).
 * Requiere OPENAI_API_KEY en el entorno.
 */

import { NextRequest } from "next/server";
import { getReleaseById } from "@/lib/data/releases";
import { explainReleaseWithAI } from "@/lib/ai/explainRelease";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY no configurada. Añádela en .env para usar la explicación con IA." },
      { status: 503 }
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
  if (!releaseId || typeof releaseId !== "string") {
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
    const message = error instanceof Error ? error.message : "Error al generar explicación";
    return Response.json(
      { error: message },
      { status: 502 }
    );
  }
}
