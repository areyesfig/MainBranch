import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { getConfirmedSubscribers } from "@/lib/db/subscribers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mainbranch.cl";
const FROM = process.env.RESEND_FROM ?? "Main Branch <newsletter@mainbranch.cl>";
const RELEASES_IN_DIGEST = 6;

function buildEmailHtml(
  releases: { id: string; technology: string; version: string; tldr: string; releaseDate: Date | string; breakingChange: boolean }[],
  unsubscribeToken: string
): string {
  const dateStr = new Date().toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  const releaseItems = releases
    .map((r) => {
      const badge = r.breakingChange
        ? `<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;">⚠️ Breaking Change</span>`
        : `<span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;">🚀 Release</span>`;

      const tldr = r.tldr.slice(0, 180) + (r.tldr.length > 180 ? "…" : "");

      return `
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:16px;background:#fff;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            ${badge}
          </div>
          <h2 style="margin:0 0 4px 0;font-size:18px;color:#111827;">
            ${r.technology}
            <span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:4px;font-size:14px;margin-left:6px;">v${r.version}</span>
          </h2>
          <p style="margin:8px 0 12px 0;color:#6b7280;font-size:14px;line-height:1.5;">${tldr}</p>
          <a href="${SITE_URL}/releases/${r.id}"
             style="display:inline-block;background:#2563eb;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;">
            Ver detalles →
          </a>
        </div>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:#111827;border-radius:12px 12px 0 0;padding:24px 28px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Main Branch</h1>
      <p style="margin:6px 0 0 0;color:#9ca3af;font-size:13px;">${dateStr}</p>
    </div>

    <!-- Body -->
    <div style="background:#f9fafb;padding:24px 28px;">
      <p style="margin:0 0 20px 0;color:#374151;font-size:15px;">
        Hola 👋 Aquí tienes los releases más relevantes de la semana:
      </p>

      ${releaseItems}

      <div style="text-align:center;margin-top:24px;">
        <a href="${SITE_URL}/releases"
           style="display:inline-block;background:#111827;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
          Ver todos los releases →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6;border-radius:0 0 12px 12px;padding:16px 28px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">
        Recibiste este email porque te suscribiste en
        <a href="${SITE_URL}" style="color:#6b7280;">${SITE_URL}</a>.<br>
        <a href="${unsubscribeUrl}" style="color:#6b7280;">Cancelar suscripción</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Obtiene los N releases más recientes de los últimos 7 días para el digest.
 */
async function getDigestReleases() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return prisma.release.findMany({
    where: { releaseDate: { gte: since } },
    orderBy: [{ votes: "desc" }, { releaseDate: "desc" }],
    take: RELEASES_IN_DIGEST,
    select: {
      id: true,
      technology: true,
      version: true,
      tldr: true,
      releaseDate: true,
      breakingChange: true,
    },
  });
}

/**
 * Envía el digest diario a todos los suscriptores confirmados.
 * Devuelve { sent, skipped } con el resultado.
 */
export async function sendDailyDigest(): Promise<{ sent: number; skipped: number; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: 0, skipped: 0, error: "RESEND_API_KEY no configurada" };
  }

  const releases = await getDigestReleases();
  if (releases.length === 0) {
    return { sent: 0, skipped: 0, error: "Sin releases nuevos para el digest" };
  }

  const subscribers = await getConfirmedSubscribers();
  if (subscribers.length === 0) {
    return { sent: 0, skipped: 0 };
  }

  const resend = new Resend(apiKey);
  const subject = `🚀 Main Branch — ${releases.length} releases esta semana`;
  let sent = 0;
  let skipped = 0;

  // Enviar en lotes de 10 para respetar rate limits de Resend
  const batches = [];
  for (let i = 0; i < subscribers.length; i += 10) {
    batches.push(subscribers.slice(i, i + 10));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (sub: { email: string; token: string }) => {
        try {
          await resend.emails.send({
            from: FROM,
            to: sub.email,
            subject,
            html: buildEmailHtml(releases, sub.token),
          });
          sent++;
        } catch {
          skipped++;
        }
      })
    );
  }

  return { sent, skipped };
}

/**
 * Envía el email de confirmación de suscripción.
 */
export async function sendConfirmationEmail(email: string, token: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirma tu suscripción a Main Branch",
    html: `
<!DOCTYPE html>
<html lang="es">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:24px;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="margin:0 0 8px 0;font-size:20px;color:#111827;">Confirma tu suscripción</h1>
    <p style="color:#6b7280;font-size:15px;line-height:1.6;">
      Haz click en el botón para confirmar y empezar a recibir el resumen semanal de releases tech.
    </p>
    <a href="${confirmUrl}"
       style="display:inline-block;margin-top:16px;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
      Confirmar suscripción →
    </a>
    <p style="margin-top:24px;color:#9ca3af;font-size:12px;">
      Si no solicitaste esta suscripción, ignora este email.
    </p>
  </div>
</body>
</html>`,
  });
}
