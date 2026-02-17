/**
 * Cron digest script for Railway Cron Service.
 * Generates weekly digests on Mondays, monthly digests on the 1st.
 *
 * Environment variables:
 *   APP_URL     - Base URL of the app
 *   CRON_SECRET - Bearer token for authentication
 *
 * Usage:
 *   node scripts/cron-digest.mjs
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

const generateUrl = `${APP_URL}/api/digest/generate`;

async function generateDigest(period) {
  console.log(`[cron-digest] Generating ${period} digest via ${generateUrl}`);

  const response = await fetch(generateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CRON_SECRET}`,
    },
    body: JSON.stringify({ period }),
  });

  const body = await response.text();

  if (!response.ok) {
    console.error(
      `[cron-digest] ${period} digest failed (${response.status}): ${body}`
    );
    return false;
  }

  console.log(`[cron-digest] ${period} digest completed (${response.status}): ${body}`);
  return true;
}

try {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=dom, 1=lun
  const dayOfMonth = today.getDate();

  let success = true;

  // Lunes: generar digest semanal
  if (dayOfWeek === 1) {
    const ok = await generateDigest("weekly");
    if (!ok) success = false;
  }

  // Día 1: generar digest mensual
  if (dayOfMonth === 1) {
    const ok = await generateDigest("monthly");
    if (!ok) success = false;
  }

  if (dayOfWeek !== 1 && dayOfMonth !== 1) {
    console.log("[cron-digest] No digest to generate today (not Monday or 1st)");
  }

  if (!success) process.exit(1);
} catch (error) {
  console.error("[cron-digest] Request failed:", error);
  process.exit(1);
}
