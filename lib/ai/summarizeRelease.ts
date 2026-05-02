import type { ReleaseNote, AISummary } from "@/types/release";
import { z } from "zod";

const AISummarySchema = z.object({
  tldr: z.string().max(200),
  changes: z.array(z.string()).min(1).max(4),
  audience: z.string().max(300),
  action_level: z.enum(["none", "recommended", "required"]),
  action_reason: z.string().max(200),
  migration: z
    .object({
      before: z.string(),
      after: z.string(),
      note: z.string(),
    })
    .nullable(),
});

const SkipSchema = z.object({ skip: z.literal(true) });

const SYSTEM_PROMPT = `Eres editor de Main Branch, un sitio en español que cubre releases de software y herramientas de IA. Tu trabajo es traducir changelogs técnicos a algo que un dev pueda escanear en 5 segundos y decidir si le importa.

Voz editorial:
- Español neutro, directo, sin jerga corporativa.
- Usa "tú" (no "usted").
- Sin adjetivos vacíos: "potente", "robusto", "innovador".
- Si algo es opcional, dilo. Si rompe código, dilo claro.
- No inventes. Si el changelog no dice algo, no lo digas.

Devuelve SOLO un JSON válido con esta forma exacta (sin markdown, sin texto extra):

{
  "tldr": "Una frase, máximo 25 palabras.",
  "changes": [
    "Bullet 1 en lenguaje humano (máx 25 palabras)",
    "Bullet 2",
    "Bullet 3"
  ],
  "audience": "Una frase que empiece con 'Solo si...', 'Si...', o 'Todos los que...'",
  "action_level": "none" | "recommended" | "required",
  "action_reason": "Una frase corta explicando el nivel",
  "migration": null
}

Reglas:
- Máximo 4 bullets en "changes". Si hay más, fusiona los menores.
- "action_level": "required" SOLO si hay cambio que rompe código existente sin migración automática.
- "migration": objeto { "before": "...", "after": "...", "note": "..." } solo si hay breaking real con ejemplo.
- Si no hay nada digno de resumir, devuelve {"skip": true}.`;

function buildInput(release: ReleaseNote): string {
  const parts = [
    `Paquete: ${release.technology} v${release.version}`,
    `Es breaking: ${release.breakingChange ? "sí" : "no"}`,
    `Resumen: ${release.tldr}`,
  ];

  if (release.description && release.description.length > 10) {
    parts.push(`Descripción: ${release.description.slice(0, 1500)}`);
  }
  if (release.features?.length) {
    parts.push(`Nuevas características: ${release.features.join("; ")}`);
  }
  if (release.improvements?.length) {
    parts.push(`Mejoras: ${release.improvements.join("; ")}`);
  }
  if (release.bugFixes?.length) {
    parts.push(`Correcciones: ${release.bugFixes.join("; ")}`);
  }
  if (release.breakingChanges?.length) {
    parts.push(`Breaking changes: ${release.breakingChanges.join("; ")}`);
  }

  return parts.join("\n\n");
}

export async function summarizeReleaseWithAI(
  release: ReleaseNote,
  apiKey: string,
  model = "gpt-4o-mini"
): Promise<AISummary | null> {
  const input = buildInput(release);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Genera el resumen editorial para este release:\n\n${input}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API error ${response.status}: ${JSON.stringify(err)}`
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const rawText = data.choices?.[0]?.message?.content?.trim();
  if (!rawText) throw new Error("OpenAI no devolvió texto");

  // Parse JSON — model may wrap in ```json ... ```
  const jsonText = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`JSON inválido en respuesta IA: ${jsonText.slice(0, 200)}`);
  }

  // Check for skip signal
  const skipResult = SkipSchema.safeParse(parsed);
  if (skipResult.success) return null;

  // Validate structure
  const result = AISummarySchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Schema inválido: ${result.error.message}`);
  }

  return result.data as AISummary;
}
