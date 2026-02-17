/**
 * Capa de acceso a datos para digests
 */

import { prisma } from "@/lib/db";
import type { Digest } from "@/types/digest";
import type { DigestPeriod } from "@/lib/schemas/digest";

function parseJson<T>(json: string | null): T | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}

function dbToDigest(
  r: Awaited<ReturnType<typeof prisma.digest.findFirst>>
): Digest | null {
  if (!r) return null;

  return {
    id: r.id,
    period: r.period as Digest["period"],
    startDate: r.startDate,
    endDate: r.endDate,
    content: r.content,
    technologies: parseJson<string[]>(r.technologies) ?? [],
    releaseCount: r.releaseCount,
    generatedAt: r.generatedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

/**
 * Obtiene todos los digests, opcionalmente filtrados por periodo
 */
export async function getDigestsFromDb(period?: DigestPeriod): Promise<Digest[]> {
  const digests = await prisma.digest.findMany({
    where: period ? { period } : undefined,
    orderBy: { startDate: "desc" },
  });
  return digests.map((r) => dbToDigest(r)!).filter(Boolean);
}

/**
 * Obtiene un digest por ID
 */
export async function getDigestByIdFromDb(id: string): Promise<Digest | null> {
  const digest = await prisma.digest.findUnique({
    where: { id },
  });
  return dbToDigest(digest);
}

/**
 * Upsert de digest por (period, startDate)
 */
export async function upsertDigest(data: {
  period: DigestPeriod;
  startDate: Date;
  endDate: Date;
  content: string;
  technologies: string[];
  releaseCount: number;
}): Promise<Digest> {
  const techJson = JSON.stringify(data.technologies);

  const result = await prisma.digest.upsert({
    where: {
      period_startDate: {
        period: data.period,
        startDate: data.startDate,
      },
    },
    create: {
      period: data.period,
      startDate: data.startDate,
      endDate: data.endDate,
      content: data.content,
      technologies: techJson,
      releaseCount: data.releaseCount,
    },
    update: {
      content: data.content,
      technologies: techJson,
      releaseCount: data.releaseCount,
      endDate: data.endDate,
      generatedAt: new Date(),
    },
  });

  return dbToDigest(result)!;
}
