/**
 * Cron sync script for Railway Cron Service.
 * Calls the /api/sync endpoint with CRON_SECRET authentication.
 *
 * Environment variables:
 *   APP_URL     - Base URL of the app (e.g. https://mainbranch-production.up.railway.app)
 *   CRON_SECRET - Bearer token for sync endpoint authentication
 *
 * Usage:
 *   npx tsx scripts/cron-sync.ts
 */

const APP_URL = process.env.APP_URL;
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

console.log(`[cron-sync] Starting sync request to ${syncUrl}`);

try {
  const response = await fetch(syncUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
    },
  });

  const body = await response.text();

  if (!response.ok) {
    console.error(
      `[cron-sync] Sync failed with status ${response.status}: ${body}`
    );
    process.exit(1);
  }

  console.log(`[cron-sync] Sync completed (${response.status}): ${body}`);
} catch (error) {
  console.error("[cron-sync] Request failed:", error);
  process.exit(1);
}
