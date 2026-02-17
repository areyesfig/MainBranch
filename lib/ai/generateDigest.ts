/**
 * Genera un digest (resumen semanal/mensual) usando OpenAI.
 * Sigue el patrón de lib/ai/explainRelease.ts.
 */

import type { ReleaseNote } from "@/types/release";
import type { DigestPeriod } from "@/lib/schemas/digest";
import { formatDateRange } from "@/lib/utils/dateRanges";

/**
 * Agrupa releases por tecnología y construye un resumen estructurado.
 * Prioriza breaking changes y features, trunca a ~6000 chars.
 */
function buildDigestInput(releases: ReleaseNote[]): string {
  const MAX_CHARS = 6000;
  const byTech = new Map<string, ReleaseNote[]>();

  for (const r of releases) {
    const group = byTech.get(r.technology) ?? [];
    group.push(r);
    byTech.set(r.technology, group);
  }

  const parts: string[] = [];

  for (const [tech, techReleases] of byTech) {
    const lines: string[] = [`## ${tech}`];

    for (const r of techReleases) {
      lines.push(`- **v${r.version}** (${new Date(r.releaseDate).toLocaleDateString("es-ES")}): ${r.tldr}`);

      if (r.breakingChange && r.breakingChanges?.length) {
        lines.push(`  Breaking changes: ${r.breakingChanges.join("; ")}`);
      }
      if (r.features?.length) {
        lines.push(`  Features: ${r.features.join("; ")}`);
      }
      if (r.improvements?.length) {
        lines.push(`  Mejoras: ${r.improvements.slice(0, 3).join("; ")}`);
      }
    }

    parts.push(lines.join("\n"));
  }

  let result = parts.join("\n\n");
  if (result.length > MAX_CHARS) {
    result = result.slice(0, MAX_CHARS) + "\n\n[...truncado]";
  }
  return result;
}

const SYSTEM_PROMPT = `Eres un editor técnico que redacta resúmenes de releases de software para desarrolladores.
Tu tarea es crear un digest claro y útil en español con formato Markdown.

Estructura del digest:
1. **Resumen general** — Párrafo breve describiendo las tendencias del período.
2. **Breaking Changes** — Si hay cambios que rompen compatibilidad, listarlos destacados con la tecnología afectada.
3. **Nuevas Características Destacadas** — Las features más relevantes agrupadas por tecnología.
4. **Otras Actualizaciones** — Mejoras y correcciones importantes resumidas.
5. **Recomendaciones** — Cierra con 2-3 recomendaciones prácticas para los desarrolladores.

Reglas:
- Usa Markdown con headers ##, listas, y **negritas** para destacar.
- Sé conciso pero informativo.
- No inventes información; solo resume lo proporcionado.
- Prioriza lo que tiene mayor impacto para los desarrolladores.
- Agrupa por relevancia, no necesariamente por tecnología.`;

export async function generateDigestWithAI(
  releases: ReleaseNote[],
  period: DigestPeriod,
  startDate: Date,
  endDate: Date,
  apiKey: string,
  model = "gpt-4o-mini"
): Promise<string> {
  const input = buildDigestInput(releases);
  const dateRange = formatDateRange(startDate, endDate);
  const periodLabel = period === "weekly" ? "semanal" : "mensual";

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
          content: `Genera un digest ${periodLabel} para el período ${dateRange}.\n\nTotal de releases: ${releases.length}\n\nDatos de releases:\n\n${input}`,
        },
      ],
      max_tokens: 2000,
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
    throw new Error("OpenAI no devolvió texto para el digest");
  }
  return content;
}
