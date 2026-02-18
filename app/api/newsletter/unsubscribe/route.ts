/**
 * GET /api/newsletter/unsubscribe?token=xxx
 * Cancela la suscripción y redirige a la home.
 */

import { NextRequest } from "next/server";
import { findSubscriberByToken, deleteSubscriberByToken } from "@/lib/db/subscribers";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token.length > 100) {
    redirect("/?newsletter=invalid");
  }

  const subscriber = await findSubscriberByToken(token);
  if (subscriber) {
    await deleteSubscriberByToken(token);
  }

  redirect("/?newsletter=unsubscribed");
}
