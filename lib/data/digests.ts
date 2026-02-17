/**
 * Capa unificada de datos para digests
 */

import type { Digest } from "@/types/digest";
import type { DigestPeriod } from "@/lib/schemas/digest";
import { getDigestsFromDb, getDigestByIdFromDb } from "@/lib/db/digests";

/**
 * Obtiene digests, opcionalmente filtrados por periodo
 */
export async function getDigests(period?: DigestPeriod): Promise<Digest[]> {
  try {
    return await getDigestsFromDb(period);
  } catch (error) {
    console.error("[getDigests] Error:", error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Obtiene un digest por ID
 */
export async function getDigestById(id: string): Promise<Digest | null> {
  try {
    return await getDigestByIdFromDb(id);
  } catch (error) {
    console.error("[getDigestById] Error:", error instanceof Error ? error.message : error);
    return null;
  }
}
