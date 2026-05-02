/**
 * Backfill de resúmenes IA para releases existentes.
 *
 * Uso:
 *   npx tsx scripts/backfill-summaries.ts
 *   npx tsx scripts/backfill-summaries.ts --dry-run       # muestra qué procesaría sin llamar IA
 *   npx tsx scripts/backfill-summaries.ts --limit 20      # procesa solo N releases
 *   npx tsx scripts/backfill-summaries.ts --force         # regenera aunque ya tengan resumen
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { prisma } from "../lib/db";
import { summarizeReleaseWithAI } from "../lib/ai/summarizeRelease";
import { shouldGenerateSummary } from "../lib/feed/shouldGenerateSummary";
import type { ReleaseNote, AISummary } from "../types/release";

const DELAY_MS = 2000; // entre llamadas para no saturar la API

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const limitArg = args.find((a) => a.startsWith("--limit=") || a === "--limit");
const LIMIT = limitArg
  ? parseInt(args[args.indexOf("--limit") + 1] ?? limitArg.split("=")[1], 10)
  : Infinity;

function parseJson<T>(json: string | null): T | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}

function dbToReleaseNote(r: {
  id: string; technology: string; version: string; releaseDate: Date;
  tldr: string; description: string; breakingChange: boolean;
  features: string | null; improvements: string | null; bugFixes: string | null;
  breakingChanges: string | null; aiSummary: string | null;
  officialUrl: string | null; category: string | null; impactScore: number | null;
  votes: number;
}): ReleaseNote {
  return {
    id: r.id,
    technology: r.technology,
    version: r.version,
    releaseDate: r.releaseDate,
    tldr: r.tldr,
    description: r.description,
    breakingChange: r.breakingChange,
    features: parseJson<string[]>(r.features),
    improvements: parseJson<string[]>(r.improvements),
    bugFixes: parseJson<string[]>(r.bugFixes),
    breakingChanges: parseJson<string[]>(r.breakingChanges),
    aiSummary: parseJson<AISummary>(r.aiSummary),
    officialUrl: r.officialUrl ?? undefined,
    category: r.category ?? undefined,
    impactScore: r.impactScore ?? undefined,
    votes: r.votes,
  };
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !DRY_RUN) {
    console.error("OPENAI_API_KEY no configurada. Usa --dry-run o configura la clave.");
    process.exit(1);
  }

  const releases = await prisma.release.findMany({
    orderBy: { releaseDate: "desc" },
    select: {
      id: true, technology: true, version: true, releaseDate: true,
      tldr: true, description: true, breakingChange: true,
      features: true, improvements: true, bugFixes: true, breakingChanges: true,
      aiSummary: true, officialUrl: true, category: true, impactScore: true, votes: true,
    },
  });

  const candidates = releases
    .map(dbToReleaseNote)
    .filter((r) => shouldGenerateSummary(r) && (FORCE || !r.aiSummary));

  const toProcess = isFinite(LIMIT) ? candidates.slice(0, LIMIT) : candidates;

  console.log(`Total releases: ${releases.length}`);
  console.log(`Candidatos a resumen: ${candidates.length}`);
  console.log(`A procesar (limit=${isFinite(LIMIT) ? LIMIT : "todos"}): ${toProcess.length}`);

  if (DRY_RUN) {
    console.log("\nDRY RUN — releases que se procesarían:");
    for (const r of toProcess) {
      console.log(`  [${r.breakingChange ? "BREAKING" : "      "}] ${r.technology} v${r.version}`);
    }
    await prisma.$disconnect();
    return;
  }

  let ok = 0, skipped = 0, errors = 0;

  for (const release of toProcess) {
    process.stdout.write(`  ${release.technology} v${release.version} … `);
    try {
      const summary = await summarizeReleaseWithAI(release, apiKey!);
      if (!summary) {
        console.log("omitido (IA decidió skip)");
        skipped++;
      } else {
        await prisma.release.update({
          where: { id: release.id },
          data: { aiSummary: JSON.stringify(summary), aiSummaryGeneratedAt: new Date() },
        });
        console.log(`ok (action: ${summary.action_level})`);
        ok++;
      }
    } catch (e) {
      console.log(`ERROR: ${e instanceof Error ? e.message : e}`);
      errors++;
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nResumen: ${ok} generados | ${skipped} omitidos | ${errors} errores`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
