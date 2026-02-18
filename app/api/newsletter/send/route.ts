/**
 * POST /api/newsletter/send
 * Dispara el envío del digest diario a todos los suscriptores confirmados.
 * Protegido por CRON_SECRET (igual que /api/sync).
 */

import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { sendDailyDigest } from "@/lib/email/digest";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return process.env.NODE_ENV !== "production";
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  try {
    const secretBuf = Buffer.from(cronSecret, "utf8");
    const tokenBuf = Buffer.from(token, "utf8");
    if (secretBuf.length !== tokenBuf.length) {
      timingSafeEqual(secretBuf, secretBuf);
      return false;
    }
    return timingSafeEqual(secretBuf, tokenBuf);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const result = await sendDailyDigest();
  console.log(`[newsletter] Digest enviado: ${result.sent} ok, ${result.skipped} errores`);

  return Response.json({ success: !result.error, ...result });
}
