import type { ReleaseNote } from "@/types/release";

export type FeedItem =
  | { kind: "single"; release: ReleaseNote }
  | {
      kind: "group";
      tech: string;
      category?: string;
      releases: ReleaseNote[];
      latest: Date;
      hasBreaking: boolean;
    };

const SIX_HOURS = 6 * 60 * 60 * 1000;
const MIN_GROUP_SIZE = 3;

export function buildFeed(releases: ReleaseNote[]): FeedItem[] {
  const items: FeedItem[] = [];
  const used = new Set<string>();

  for (const r of releases) {
    if (used.has(r.id)) continue;

    const rTime = new Date(r.releaseDate).getTime();
    const cluster = releases.filter(
      (o) =>
        !used.has(o.id) &&
        o.technology === r.technology &&
        Math.abs(new Date(o.releaseDate).getTime() - rTime) <= SIX_HOURS
    );

    if (cluster.length >= MIN_GROUP_SIZE) {
      cluster.forEach((c) => used.add(c.id));
      const sorted = [...cluster].sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
      items.push({
        kind: "group",
        tech: r.technology,
        category: r.category,
        releases: sorted,
        latest: new Date(sorted[0].releaseDate),
        hasBreaking: cluster.some((c) => c.breakingChange),
      });
    } else {
      used.add(r.id);
      items.push({ kind: "single", release: r });
    }
  }

  return items;
}
