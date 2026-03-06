import type { ReleaseNote } from "@/types/release";
import Link from "next/link";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatTime";

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "var(--color-cat-frontend)",
  backend: "var(--color-cat-backend)",
  "ai-ml": "var(--color-cat-ai-ml)",
  llms: "var(--color-cat-llms)",
  devops: "var(--color-cat-devops)",
  mobile: "var(--color-cat-mobile)",
  databases: "var(--color-cat-databases)",
  tools: "var(--color-cat-tools)",
};

interface RelatedReleasesProps {
  releases: ReleaseNote[];
}

export default function RelatedReleases({ releases }: RelatedReleasesProps) {
  if (releases.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-semibold text-[var(--color-text-primary)]">
        Releases Relacionados
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {releases.map((release) => {
          const catColor =
            CATEGORY_COLORS[release.category ?? ""] ?? "var(--color-brand)";

          return (
            <Link
              key={release.id}
              href={`/releases/${release.id}`}
              className="group rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] hover:border-[var(--color-border-strong)]"
            >
              <p className="overline mb-2" style={{ color: catColor }}>
                {release.category?.toUpperCase()}
              </p>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug">
                {release.technology}{" "}
                <span className="text-[var(--color-text-tertiary)]">
                  v{release.version}
                </span>
              </h3>
              {release.tldr && (
                <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                  {release.tldr}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                <span>{formatRelativeTime(release.releaseDate)}</span>
                {release.impactScore != null && release.impactScore > 0 && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {release.impactScore}
                  </span>
                )}
                {release.breakingChange && (
                  <span className="flex items-center gap-1 text-[var(--color-breaking)]">
                    <AlertTriangle className="h-3 w-3" />
                    Breaking
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
