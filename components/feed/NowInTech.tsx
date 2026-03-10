import type { ReleaseNote } from "@/types/release";
import Link from "next/link";
import { Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { sanitizeReleaseText } from "@/lib/utils";

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

interface NowInTechProps {
  releases: ReleaseNote[];
}

export default function NowInTech({ releases }: NowInTechProps) {
  if (releases.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-[var(--color-high-impact)]" />
        <span className="overline text-[var(--color-text-secondary)]">
          AHORA EN TECH
        </span>
      </div>
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-3 stagger-children">
          {releases.map((r) => {
            const accentColor = CATEGORY_COLORS[r.category ?? ""] ?? "var(--color-brand)";
            return (
              <Link
                key={r.id}
                href={`/releases/${r.id}`}
                className="gradient-border-top card-glow w-[220px] sm:w-[240px] shrink-0 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4 transition-all"
                style={{ "--accent-color": accentColor } as React.CSSProperties}
                data-category={r.category ?? ""}
              >
                <span
                  className="overline block mb-1"
                  style={{ color: accentColor }}
                >
                  {r.category?.toUpperCase() ?? "RELEASE"}
                </span>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug">
                  {r.technology}{" "}
                  <span className="text-[var(--color-text-tertiary)]">v{r.version}</span>
                </h3>
                <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                  {sanitizeReleaseText(r.tldr, 80)}
                </p>
                <span className="mt-2 block text-[10px] text-[var(--color-text-tertiary)]">
                  {formatDate(r.releaseDate)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
