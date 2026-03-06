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
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] px-4 py-3">
        <Zap className="h-4 w-4 text-[var(--color-high-impact)]" />
        <span className="overline text-[var(--color-text-secondary)]">
          AHORA EN TECH
        </span>
      </div>
      <div className="divide-y divide-[var(--color-border-subtle)]">
        {releases.map((r) => {
          const dotColor = CATEGORY_COLORS[r.category ?? ""] ?? "var(--color-text-tertiary)";
          return (
            <Link
              key={r.id}
              href={`/releases/${r.id}`}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--color-bg-secondary)]"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: dotColor }}
                aria-hidden
              />
              <span className="flex-1 min-w-0 text-sm text-[var(--color-text-primary)] truncate">
                <span className="font-medium">{r.technology} v{r.version}</span>
                <span className="text-[var(--color-text-tertiary)]">
                  {" "}— {sanitizeReleaseText(r.tldr, 60)}
                </span>
              </span>
              <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
                {formatDate(r.releaseDate)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
