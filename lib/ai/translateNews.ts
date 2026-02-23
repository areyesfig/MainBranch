/**
 * Traduce título, resumen y contenido de noticias AI al español usando OpenAI.
 * Sigue el patrón de lib/ai/explainRelease.ts (fetch directo, sin SDK).
 */

const SYSTEM_PROMPT = `Eres un traductor profesional especializado en tecnología e inteligencia artificial.
Tu tarea es traducir título, resumen y contenido de noticias del inglés al español.
- Mantén nombres propios, marcas y términos técnicos en inglés (GPT, Claude, LLM, API, etc.).
- Usa español neutro/latinoamericano profesional.
- Conserva el tono informativo y conciso del original.
- Responde SOLO con JSON válido: { "titleEs": "...", "summaryEs": "...", "contentEs": "..." }`;

interface TranslationResult {
  titleEs: string;
  summaryEs: string;
  contentEs?: string;
}

export async function translateNewsArticle(
  title: string,
  summary: string,
  apiKey: string,
  model = "gpt-4o-mini",
  articleContent?: string
): Promise<TranslationResult> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Traduce al español:\n\nTitle: ${title}\n\nSummary: ${summary}${articleContent ? `\n\nContent: ${articleContent}` : ""}`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } })?.error?.message ||
        `OpenAI API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const rawContent = data.choices?.[0]?.message?.content?.trim();
  if (!rawContent) {
    throw new Error("OpenAI no devolvió contenido de traducción");
  }

  const parsed = JSON.parse(rawContent) as TranslationResult;
  if (!parsed.titleEs || !parsed.summaryEs) {
    throw new Error("Respuesta de traducción incompleta");
  }

  return parsed;
}
