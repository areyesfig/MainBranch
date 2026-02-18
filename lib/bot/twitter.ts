/**
 * Bot de X (Twitter) para publicar releases de alto impacto.
 *
 * Criterios de "alto impacto" (ver getHighImpactReleasesToTweet en lib/db/releases.ts):
 *   - votes >= 10 (comunidad), O
 *   - breakingChange = true / versión x.0.0 creada en las últimas 6.5h (auto-detectado)
 *
 * Cada release publicado se marca como tweeted=true en BD para evitar duplicados.
 * Máximo 3 tweets por ejecución del cron.
 */

import { TwitterApi } from "twitter-api-v2";
import type { ReleaseNote } from "@/types/release";
import { markAsTweeted } from "@/lib/db/releases";

const MAX_TWEETS_PER_RUN = 3;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mainbranch.cl";

function buildClient(): TwitterApi | null {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } =
    process.env;

  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    return null;
  }

  return new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET,
  });
}

function buildTweetText(release: ReleaseNote): string {
  const emoji = release.breakingChange ? "⚠️" : "🚀";
  const breakingLabel = release.breakingChange ? " [Breaking Change]" : "";
  const votesLabel = (release.votes ?? 0) > 0 ? ` · ${release.votes} votos` : "";
  const url = release.officialUrl ?? SITE_URL;

  const header = `${emoji} ${release.technology} ${release.version}${breakingLabel}${votesLabel}`;
  const summary = release.tldr.slice(0, 190);
  const tags = `#${release.technology.replace(/\s/g, "")} #Dev #MainBranch`;

  return `${header}\n\n${summary}\n\n${url}\n\n${tags}`.slice(0, 280);
}

/**
 * Publica un release en X y lo marca como tweeted en BD.
 * En desarrollo solo loguea (no llama a la API ni marca en BD).
 * Devuelve true si el tweet fue enviado (o simulado en dev).
 */
export async function tweetRelease(release: ReleaseNote): Promise<boolean> {
  const text = buildTweetText(release);

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[bot/twitter] MODO DEV — tweet simulado:\n${text}\n${"─".repeat(40)}`
    );
    return true;
  }

  const client = buildClient();
  if (!client) {
    console.warn("[bot/twitter] Credenciales X no configuradas — omitiendo tweet.");
    return false;
  }

  try {
    await client.v2.tweet(text);
    await markAsTweeted(release.id);
    console.log(
      `[bot/twitter] Tweet publicado: ${release.technology} ${release.version}`
    );
    return true;
  } catch (err) {
    console.error("[bot/twitter] Error al publicar tweet:", err);
    return false;
  }
}

/**
 * Publica tweets para una lista de releases de alto impacto.
 * Máximo MAX_TWEETS_PER_RUN por ejecución.
 * Devuelve cuántos tweets se enviaron.
 */
export async function tweetHighImpactReleases(
  releases: ReleaseNote[]
): Promise<number> {
  if (releases.length === 0) {
    console.log("[bot/twitter] Sin releases de alto impacto pendientes de publicar.");
    return 0;
  }

  const toTweet = releases.slice(0, MAX_TWEETS_PER_RUN);
  let sent = 0;

  for (const release of toTweet) {
    const ok = await tweetRelease(release);
    if (ok) sent++;
    if (sent < toTweet.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return sent;
}
