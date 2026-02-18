/**
 * Bot de Telegram para publicar releases de alto impacto.
 * Usa la Bot API directamente vía fetch — sin librería extra.
 *
 * Setup (una vez):
 *   1. Crea un bot con @BotFather → guarda el token
 *   2. Crea un canal de Telegram (público o privado)
 *   3. Agrega el bot como administrador del canal
 *   4. Obtén el TELEGRAM_CHANNEL_ID:
 *      - Canal público:  @nombre_del_canal
 *      - Canal privado:  -100XXXXXXXXXX (numérico)
 *
 * Variables de entorno:
 *   TELEGRAM_BOT_TOKEN   → token del bot de @BotFather
 *   TELEGRAM_CHANNEL_ID  → @canal o -100XXXXXXXXXX
 *
 * Máximo 3 mensajes por ejecución. Cada release se marca
 * telegramPosted=true para no repetirlo.
 */

import type { ReleaseNote } from "@/types/release";
import { markAsTelegramPosted } from "@/lib/db/releases";

const MAX_POSTS_PER_RUN = 3;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mainbranch.cl";

function buildMessage(release: ReleaseNote): string {
  const emoji = release.breakingChange ? "⚠️" : "🚀";
  const breaking = release.breakingChange ? " <b>[Breaking Change]</b>" : "";
  const votes = (release.votes ?? 0) > 0 ? ` · ${release.votes} votos` : "";
  const url = release.officialUrl ?? `${SITE_URL}/releases/${release.id}`;

  // Telegram HTML: <b>, <i>, <code>, <a href="">
  const header = `${emoji} <b>${release.technology} v${release.version}</b>${breaking}${votes}`;
  const summary = release.tldr.slice(0, 800);
  const link = `🔗 <a href="${url}">Ver detalles completos</a>`;
  const tags = `#${release.technology.replace(/[\s.]/g, "")} #Dev #MainBranch`;

  return `${header}\n\n${summary}\n\n${link}\n${tags}`;
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!token || !channelId) return false;

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { description?: string };
    console.error(`[bot/telegram] Error ${res.status}: ${err.description ?? "unknown"}`);
    return false;
  }
  return true;
}

/**
 * Publica un release en el canal de Telegram.
 * En desarrollo solo loguea.
 */
export async function postReleaseToTelegram(release: ReleaseNote): Promise<boolean> {
  const text = buildMessage(release);
  const isDev = process.env.NODE_ENV !== "production";

  console.log(`[bot/telegram] NODE_ENV=${process.env.NODE_ENV}, release=${release.technology} ${release.version}`);

  if (isDev) {
    console.log(`[bot/telegram] MODO DEV — mensaje simulado:\n${text}\n${"─".repeat(40)}`);
    return true;
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHANNEL_ID) {
    const missing = ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHANNEL_ID"]
      .filter((k) => !process.env[k])
      .join(", ");
    console.warn(`[bot/telegram] Credenciales faltantes: ${missing}`);
    return false;
  }

  const ok = await sendTelegramMessage(text);
  if (ok) {
    await markAsTelegramPosted(release.id);
    console.log(`[bot/telegram] Publicado: ${release.technology} ${release.version}`);
  }
  return ok;
}

/**
 * Publica hasta MAX_POSTS_PER_RUN releases en el canal.
 * Devuelve cuántos mensajes se enviaron.
 */
export async function postHighImpactReleasesToTelegram(
  releases: ReleaseNote[]
): Promise<number> {
  if (releases.length === 0) {
    console.log("[bot/telegram] Sin releases pendientes de publicar.");
    return 0;
  }

  const toPost = releases.slice(0, MAX_POSTS_PER_RUN);
  let sent = 0;

  for (const release of toPost) {
    const ok = await postReleaseToTelegram(release);
    if (ok) sent++;
    // Pausa entre mensajes para respetar rate limits de Telegram (30 msg/seg en canales)
    if (sent < toPost.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return sent;
}
