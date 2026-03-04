/**
 * Cron sync script for Railway Cron Service.
 * Calls the /api/sync endpoint with CRON_SECRET authentication.
 *
 * Environment variables:
 *   APP_URL     - Base URL of the app (e.g. https://mainbranch-production.up.railway.app)
 *   CRON_SECRET - Bearer token for sync endpoint authentication
 *
 * Usage:
 *   node scripts/cron-sync.mjs
 */

const rawUrl = process.env.APP_URL;
const APP_URL = rawUrl && !rawUrl.startsWith("http") ? `https://${rawUrl}` : rawUrl;
const CRON_SECRET = process.env.CRON_SECRET;

if (!APP_URL) {
  console.error("Missing APP_URL environment variable");
  process.exit(1);
}

if (!CRON_SECRET) {
  console.error("Missing CRON_SECRET environment variable");
  process.exit(1);
}

const syncUrl = `${APP_URL}/api/sync`;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10_000; // 10 segundos entre reintentos

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptSync(attempt) {
  console.log(`[cron-sync] Attempt ${attempt}/${MAX_RETRIES} — ${syncUrl}`);

  const response = await fetch(syncUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
    },
    signal: AbortSignal.timeout(300_000), // 5 minutos
  });

  const body = await response.text();

  if (response.ok) {
    console.log(`[cron-sync] Sync completed (${response.status}): ${body}`);
    return true;
  }

  // 502/503/504 son errores transitorios, reintentar
  if ([502, 503, 504].includes(response.status) && attempt < MAX_RETRIES) {
    console.warn(
      `[cron-sync] Got ${response.status}, retrying in ${RETRY_DELAY_MS / 1000}s...`
    );
    return false;
  }

  console.error(
    `[cron-sync] Sync failed with status ${response.status}: ${body}`
  );
  process.exit(1);
}

try {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const ok = await attemptSync(attempt);
    if (ok) break;
    if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    if (attempt === MAX_RETRIES) {
      console.error("[cron-sync] All retries exhausted");
      process.exit(1);
    }
  }
} catch (error) {
  console.error("[cron-sync] Request failed:", error);
  process.exit(1);
}
