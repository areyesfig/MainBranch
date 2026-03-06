import type { ReleaseNote } from "@/types/release";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

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

interface TrendingItemProps {
  release: ReleaseNote;
  rank: number;
}

export default function TrendingItem({ release, rank }: TrendingItemProps) {
  const catColor = CATEGORY_COLORS[release.category ?? ""];

  return (
    <Link
      href={`/releases/${release.id}`}
      className="group flex items-center gap-3 py-2 transition-colors hover:bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] px-2 -mx-2"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold text-[var(--color-text-tertiary)]">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
          {release.technology} v{release.version}
        </p>
        {catColor && (
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: catColor }}>
            {release.category}
          </span>
        )}
      </div>
      {release.votes != null && release.votes > 0 && (
        <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
          <TrendingUp className="h-3 w-3" />
          {release.votes}
        </span>
      )}
    </Link>
  );
}
