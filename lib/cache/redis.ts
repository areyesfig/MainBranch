/**
 * Cliente Redis — caché opcional delante de Postgres.
 *
 * Si REDIS_URL no está definida, todas las funciones son no-ops y la app
 * funciona igual que antes (fallback transparente a la BD).
 */

import Redis from "ioredis";

const PREFIX = "mb:releases";

export const CACHE_KEYS = {
  ALL: `${PREFIX}:all`,
  STACK: (stack: string) => `${PREFIX}:stack:${stack}`,
  CATEGORY: (cat: string) => `${PREFIX}:category:${cat}`,
  ID: (id: string) => `${PREFIX}:id:${id}`,
  COUNT: `${PREFIX}:count`,
} as const;

export const CACHE_TTL = {
  LONG: 3600, // 1 hora — listas de releases
  SHORT: 300, // 5 minutos — conteos
} as const;

// Singleton: reutiliza la conexión entre invocaciones en el mismo proceso
const globalForRedis = globalThis as unknown as { _redisClient: Redis | null };

function getClient(): Redis | null {
  if (!process.env.REDIS_URL) return null;

  if (!globalForRedis._redisClient) {
    globalForRedis._redisClient = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 3000,
    });

    globalForRedis._redisClient.on("error", (err: Error) => {
      console.error("[Redis]", err.message);
    });
  }

  return globalForRedis._redisClient;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getClient();
  if (!redis) return null;
  try {
    const raw = await redis.get(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttl: number = CACHE_TTL.LONG
): Promise<void> {
  const redis = getClient();
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {
    // El caché es opcional — nunca propagar el error
  }
}

/**
 * Elimina todas las claves mb:releases:* de Redis.
 * Se llama tras un sync para que el siguiente request sirva datos frescos.
 */
export async function invalidateAllReleaseCache(): Promise<void> {
  const redis = getClient();
  if (!redis) return;
  try {
    const keys = await redis.keys(`${PREFIX}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis] Invalidados ${keys.length} keys`);
    }
  } catch {
    // Silencioso — la invalidación es best-effort
  }
}
