/**
 * Bot de X (Twitter) para publicar releases de alto impacto.
 *
 * Criterio de "alto impacto":
 *   - breakingChange: true, O
 *   - versión mayor (x.0.0)
 *
 * Solo publica releases indexados en las últimas 6.5 horas
 * (ventana del cron) para evitar duplicados entre syncs.
 * Máximo 3 tweets por ejecución.
 */

import { TwitterApi } from "twitter-api-v2";
import type { ReleaseNote } from "@/types/release";

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
  const url = release.officialUrl ?? `${SITE_URL}`;

  const header = `${emoji} ${release.technology} ${release.version}${breakingLabel}`;
  const summary = release.tldr.slice(0, 200);
  const tags = `#${release.technology.replace(/\s/g, "")} #Dev #MainBranch`;

  return `${header}\n\n${summary}\n\n${url}\n\n${tags}`.slice(0, 280);
}

/**
 * Publica un release en X. En desarrollo solo loguea.
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
  const toTweet = releases.slice(0, MAX_TWEETS_PER_RUN);
  let sent = 0;

  for (const release of toTweet) {
    const ok = await tweetRelease(release);
    if (ok) sent++;
    // Pausa entre tweets para respetar rate limits
    if (sent < toTweet.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return sent;
}
