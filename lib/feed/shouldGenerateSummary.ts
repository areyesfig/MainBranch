import type { ReleaseNote } from "@/types/release";

const PRIORITY_TECHS = new Set([
  "anthropic sdk typescript",
  "claude code",
  "astro",
  "remix",
  "next.js",
  "react",
  "vite",
  "openai sdk",
  "typescript",
  "node.js",
  "vue",
  "svelte",
  "prisma",
  "deno",
  "bun",
  "docker",
  "kubernetes",
  "vercel",
  "tailwind css",
  "grok",
]);

function isMajorOrMinor(version: string): boolean {
  const parts = version.replace(/^v/, "").split(".");
  if (parts.length < 3) return true;
  return parts[2] === "0";
}

function totalContentLength(release: ReleaseNote): number {
  return [
    release.description,
    release.tldr,
    ...(release.features ?? []),
    ...(release.improvements ?? []),
    ...(release.breakingChanges ?? []),
  ]
    .filter(Boolean)
    .join(" ").length;
}

const PATCH_ONLY_PATTERN = /^bump(ed)?\s/i;

export function shouldGenerateSummary(release: ReleaseNote): boolean {
  // Never generate for trivial patch bumps with no real content
  if (PATCH_ONLY_PATTERN.test(release.tldr ?? "")) {
    const len = totalContentLength(release);
    if (len < 100) return false;
  }

  // Always for breaking changes
  if (release.breakingChange) return true;

  // Major or minor versions
  if (isMajorOrMinor(release.version)) return true;

  // Priority technologies (always worth summarizing)
  if (PRIORITY_TECHS.has(release.technology.toLowerCase())) return true;

  // Rich content
  if (totalContentLength(release) > 200) return true;

  return false;
}
