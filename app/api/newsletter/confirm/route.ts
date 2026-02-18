/**
 * GET /api/newsletter/confirm?token=xxx
 * Confirma la suscripción y redirige a la home con banner de éxito.
 */

import { NextRequest } from "next/server";
import { findSubscriberByToken, confirmSubscriber } from "@/lib/db/subscribers";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token.length > 100) {
    redirect("/?newsletter=invalid");
  }

  const subscriber = await findSubscriberByToken(token);
  if (!subscriber) {
    redirect("/?newsletter=invalid");
  }

  if (!subscriber.confirmedAt) {
    await confirmSubscriber(token);
  }

  redirect("/?newsletter=confirmed");
}
