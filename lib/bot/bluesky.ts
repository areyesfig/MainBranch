/**
 * Bot de Bluesky para publicar releases de alto impacto.
 * API gratuita — no requiere plan de pago.
 *
 * Credenciales necesarias:
 *   BSKY_HANDLE       → tu handle (ej: mainbranch.bsky.social)
 *   BSKY_APP_PASSWORD → contraseña de app generada en https://bsky.app/settings/app-passwords
 *
 * Criterios de "alto impacto" (ver getHighImpactReleasesToTweet en lib/db/releases.ts):
 *   - votes >= 10 (comunidad), O
 *   - breakingChange = true / versión x.0.0
 *
 * Cada release publicado se marca como tweeted=true en BD para evitar duplicados.
 * Máximo 3 posts por ejecución del cron.
 */

import { BskyAgent } from "@atproto/api";
import type { ReleaseNote } from "@/types/release";
import { markAsTweeted } from "@/lib/db/releases";

const MAX_POSTS_PER_RUN = 3;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mainbranch.cl";

async function buildAgent(): Promise<BskyAgent | null> {
  const { BSKY_HANDLE, BSKY_APP_PASSWORD } = process.env;
  if (!BSKY_HANDLE || !BSKY_APP_PASSWORD) return null;

  const agent = new BskyAgent({ service: "https://bsky.social" });
  try {
    await agent.login({ identifier: BSKY_HANDLE, password: BSKY_APP_PASSWORD });
    return agent;
  } catch (err) {
    console.error("[bot/bluesky] Error al autenticar:", err);
    return null;
  }
}

function buildPostText(release: ReleaseNote): string {
  const emoji = release.breakingChange ? "⚠️" : "🚀";
  const breakingLabel = release.breakingChange ? " [Breaking Change]" : "";
  const votesLabel = (release.votes ?? 0) > 0 ? ` · ${release.votes} votos` : "";
  const url = release.officialUrl ?? SITE_URL;

  const header = `${emoji} ${release.technology} ${release.version}${breakingLabel}${votesLabel}`;
  const summary = release.tldr.slice(0, 220);
  const tags = `#${release.technology.replace(/\s/g, "")} #Dev #MainBranch`;

  // Bluesky permite 300 caracteres
  return `${header}\n\n${summary}\n\n${url}\n\n${tags}`.slice(0, 300);
}

/**
 * Publica un release en Bluesky y lo marca como tweeted en BD.
 * En desarrollo solo loguea.
 * Devuelve true si el post fue enviado (o simulado en dev).
 */
export async function tweetRelease(release: ReleaseNote): Promise<boolean> {
  const text = buildPostText(release);
  const isDev = process.env.NODE_ENV !== "production";

  console.log(`[bot/bluesky] NODE_ENV=${process.env.NODE_ENV}, release=${release.technology} ${release.version}`);

  if (isDev) {
    console.log(`[bot/bluesky] MODO DEV — post simulado:\n${text}\n${"─".repeat(40)}`);
    return true;
  }

  const agent = await buildAgent();
  if (!agent) {
    const missing = ["BSKY_HANDLE", "BSKY_APP_PASSWORD"].filter((k) => !process.env[k]).join(", ");
    console.warn(`[bot/bluesky] Credenciales faltantes: ${missing}`);
    return false;
  }

  try {
    await agent.post({ text });
    await markAsTweeted(release.id);
    console.log(`[bot/bluesky] Post publicado: ${release.technology} ${release.version}`);
    return true;
  } catch (err) {
    console.error("[bot/bluesky] Error al publicar post:", err);
    return false;
  }
}

/**
 * Publica posts para una lista de releases de alto impacto.
 * Máximo MAX_POSTS_PER_RUN por ejecución.
 * Devuelve cuántos posts se enviaron.
 */
export async function tweetHighImpactReleases(releases: ReleaseNote[]): Promise<number> {
  if (releases.length === 0) {
    console.log("[bot/bluesky] Sin releases de alto impacto pendientes de publicar.");
    return 0;
  }

  const toPost = releases.slice(0, MAX_POSTS_PER_RUN);
  let sent = 0;

  for (const release of toPost) {
    const ok = await tweetRelease(release);
    if (ok) sent++;
    if (sent < toPost.length) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  return sent;
}
