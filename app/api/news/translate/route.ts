/**
 * POST /api/news/translate
 *
 * Traduce retroactivamente noticias existentes que no tienen titleEs/summaryEs.
 * Requiere OPENAI_API_KEY. En producción requiere CRON_SECRET.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateNewsArticle } from "@/lib/ai/translateNews";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Auth: misma lógica que /api/sync
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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY no configurada" },
      { status: 500 }
    );
  }

  // Obtener artículos sin traducción
  const articles = await prisma.newsArticle.findMany({
    where: { titleEs: null },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  if (articles.length === 0) {
    return Response.json({ message: "Todos los artículos ya tienen traducción", translated: 0 });
  }

  let translated = 0;
  const errors: string[] = [];

  for (const article of articles) {
    try {
      const { titleEs, summaryEs } = await translateNewsArticle(
        article.title,
        article.summary,
        apiKey
      );
      await prisma.newsArticle.update({
        where: { id: article.id },
        data: { titleEs, summaryEs },
      });
      translated++;
    } catch (err) {
      errors.push(
        `${article.title.slice(0, 50)}: ${err instanceof Error ? err.message : "Error"}`
      );
    }
  }

  return Response.json({
    total: articles.length,
    translated,
    errors,
  });
}
