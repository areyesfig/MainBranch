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
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptSend(attempt) {
  console.log(
    `[cron-newsletter] Attempt ${attempt}/${MAX_RETRIES} — ${sendUrl}`
  );

  const response = await fetch(sendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
    },
    signal: AbortSignal.timeout(120_000),
  });

  const body = await response.text();

  if (response.ok) {
    console.log(
      `[cron-newsletter] Completed (${response.status}): ${body}`
    );
    return true;
  }

  if ([502, 503, 504].includes(response.status) && attempt < MAX_RETRIES) {
    console.warn(
      `[cron-newsletter] Got ${response.status}, retrying in ${RETRY_DELAY_MS / 1000}s...`
    );
    return false;
  }

  console.error(
    `[cron-newsletter] Failed (${response.status}): ${body}`
  );
  process.exit(1);
}

try {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const ok = await attemptSend(attempt);
    if (ok) break;
    if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    if (attempt === MAX_RETRIES) {
      console.error("[cron-newsletter] All retries exhausted");
      process.exit(1);
    }
  }
} catch (error) {
  console.error("[cron-newsletter] Request failed:", error);
  process.exit(1);
}
