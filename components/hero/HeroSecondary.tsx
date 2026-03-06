import type { ReleaseNote } from "@/types/release";
import type { NewsArticle } from "@/types/news";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatTime";
import { formatDate } from "@/lib/utils";
import { sanitizeReleaseText } from "@/lib/utils";

type HeroSecondaryItem =
  | { type: "release"; data: ReleaseNote }
  | { type: "news"; data: NewsArticle };

interface HeroSecondaryProps {
  items: HeroSecondaryItem[];
}

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

function SecondaryCard({ item }: { item: HeroSecondaryItem }) {
  if (item.type === "release") {
    const r = item.data;
    const accentColor = CATEGORY_COLORS[r.category ?? ""] ?? "var(--color-brand)";

    return (
      <Link
        href={`/releases/${r.id}`}
        className="group flex flex-col justify-end rounded-[var(--radius-lg)] border border-white/10 bg-gray-800/50 p-5 transition-all hover:border-white/20 hover:bg-gray-800/80 flex-1"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="overline" style={{ color: accentColor }}>
            {r.category?.toUpperCase() ?? "RELEASE"}
          </span>
          {r.breakingChange && (
            <AlertTriangle className="h-3 w-3 text-red-400" />
          )}
        </div>
        <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
          {r.technology} <span className="text-white/50">v{r.version}</span>
        </h3>
        <p className="mt-1.5 line-clamp-1 text-sm text-gray-400">
          {sanitizeReleaseText(r.tldr, 80)}
        </p>
        <span className="mt-2 text-xs text-gray-500">
          {formatDate(r.releaseDate)}
        </span>
      </Link>
    );
  }

  const a = item.data;
  return (
    <a
      href={a.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-end rounded-[var(--radius-lg)] border border-white/10 bg-gray-800/50 p-5 transition-all hover:border-white/20 hover:bg-gray-800/80 flex-1"
    >
      <span className="overline text-purple-400 mb-2">NOTICIAS</span>
      <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
        {a.titleEs ?? a.title}
      </h3>
      <p className="mt-1.5 line-clamp-1 text-sm text-gray-400">
        {a.summaryEs ?? a.summary}
      </p>
      <span className="mt-2 text-xs text-gray-500">
        {formatDate(a.publishedAt)}
      </span>
    </a>
  );
}

export default function HeroSecondary({ items }: HeroSecondaryProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <SecondaryCard key={i} item={item} />
      ))}
    </div>
  );
}
