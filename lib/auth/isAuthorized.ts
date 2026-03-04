/**
 * Verificación de autorización timing-safe para rutas protegidas por CRON_SECRET.
 * Centraliza la lógica que antes se duplicaba en cada route handler.
 */

import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

export function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }
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
