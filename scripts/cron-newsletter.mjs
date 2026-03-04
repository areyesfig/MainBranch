/**
 * Cron newsletter script for Railway Cron Service.
 * Sends the weekly digest email to all confirmed subscribers.
 *
 * Environment variables:
 *   APP_URL     - Base URL of the app
 *   CRON_SECRET - Bearer token for authentication
 *
 * Usage:
 *   node scripts/cron-newsletter.mjs
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

const sendUrl = `${APP_URL}/api/newsletter/send`;

console.log(`[cron-newsletter] Sending newsletter via ${sendUrl}`);

try {
  const response = await fetch(sendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
    },
    signal: AbortSignal.timeout(120_000), // 2 minutos
  });

  const body = await response.text();

  if (!response.ok) {
    console.error(
      `[cron-newsletter] Failed (${response.status}): ${body}`
    );
    process.exit(1);
  }

  console.log(`[cron-newsletter] Completed (${response.status}): ${body}`);
} catch (error) {
  console.error("[cron-newsletter] Request failed:", error);
  process.exit(1);
}
