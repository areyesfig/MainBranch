/**
 * POST /api/newsletter/send
 * Dispara el envío del digest diario a todos los suscriptores confirmados.
 * Protegido por CRON_SECRET (igual que /api/sync).
 */

import { NextRequest } from "next/server";
import { sendDailyDigest } from "@/lib/email/digest";
import { isAuthorized } from "@/lib/auth/isAuthorized";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const result = await sendDailyDigest();
  console.log(`[newsletter] Digest enviado: ${result.sent} ok, ${result.skipped} errores`);

  return Response.json({ success: !result.error, ...result });
}
