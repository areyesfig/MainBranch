/**
 * Genera una explicación en lenguaje claro de un release usando IA.
 * Usa OpenAI Chat Completions (compatible con OpenAI API).
 */

import type { ReleaseNote } from "@/types/release";

function buildReleaseSummary(release: ReleaseNote): string {
  const parts: string[] = [
    `Tecnología: ${release.technology} ${release.version}`,
    `Resumen: ${release.tldr}`,
    `Descripción: ${release.description}`,
  ];
  if (release.breakingChange && release.breakingChanges?.length) {
    parts.push(`Cambios que rompen compatibilidad: ${release.breakingChanges.join("; ")}`);
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
  return parts.join("\n\n");
}

const SYSTEM_PROMPT = `Eres un asistente técnico que explica actualizaciones de software a desarrolladores.
Tu tarea es redactar una explicación clara y concisa en español de los cambios del release.
- Usa párrafos cortos y lenguaje directo.
- Destaca lo más importante para quien va a actualizar o evaluar la versión.
- Si hay breaking changes, explícalos de forma que quede claro qué puede romperse y qué hacer.
- No inventes información; solo resume y estructura lo que se te proporciona.
- No incluyas markdown ni enlaces; solo texto plano.`;

export async function explainReleaseWithAI(
  release: ReleaseNote,
  apiKey: string,
  model = "gpt-4o-mini"
): Promise<string> {
  const summary = buildReleaseSummary(release);

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
          content: `Explica de forma clara y útil para desarrolladores los cambios de este release:\n\n${summary}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.4,
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
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI no devolvió texto");
  }
  return content;
}
