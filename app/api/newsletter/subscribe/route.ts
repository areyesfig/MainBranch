/**
 * POST /api/newsletter/subscribe
 * Registra un email y envía el correo de confirmación.
 * Rate limit: 3 intentos por IP cada hora.
 */

import { NextRequest } from "next/server";
import { createSubscriber, findSubscriberByEmail } from "@/lib/db/subscribers";
import { sendConfirmationEmail } from "@/lib/email/digest";
import { z } from "zod";

const emailSchema = z.string().email().max(254);

const hits = new Map<string, { count: number; reset: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  entry.count++;
  return entry.count > 3;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Demasiados intentos. Vuelve en una hora." }, { status: 429 });
  }

  let email: string;
  try {
    const body = await request.json() as { email?: unknown };
    email = emailSchema.parse(body.email);
  } catch {
    return Response.json({ error: "Email inválido." }, { status: 400 });
  }

  // Si ya existe y está confirmado, no hacer nada (no revelar estado)
  const existing = await findSubscriberByEmail(email);
  if (existing?.confirmedAt) {
    return Response.json({ ok: true });
  }

  // Si existe pero no confirmado, reenviar confirmación
  if (existing) {
    await sendConfirmationEmail(existing.email, existing.token).catch(() => {});
    return Response.json({ ok: true });
  }

  try {
    const subscriber = await createSubscriber(email);
    await sendConfirmationEmail(email, subscriber.token).catch(() => {});
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Error al suscribirse. Intenta de nuevo." }, { status: 500 });
  }
}
