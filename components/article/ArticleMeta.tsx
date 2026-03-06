import { Calendar, Zap, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ShareButton from "@/components/news/ShareButton";
import BookmarkButton from "@/components/ds/BookmarkButton";
import Badge from "@/components/ds/Badge";

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

interface ArticleMetaProps {
  releaseId: string;
  category?: string | null;
  releaseDate: Date | string;
  impactScore?: number | null;
  breakingChange?: boolean;
  officialUrl?: string | null;
  shareTitle: string;
  shareUrl: string;
  technology: string;
  version: string;
}

export default function ArticleMeta({
  releaseId,
  category,
  releaseDate,
  impactScore,
  breakingChange,
  officialUrl,
  shareTitle,
  shareUrl,
  technology,
  version,
}: ArticleMetaProps) {
  const accentColor = CATEGORY_COLORS[category ?? ""] ?? "var(--color-brand)";

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {/* Category */}
      {category && (
        <Badge category={category as "frontend" | "backend" | "ai-ml" | "llms" | "devops" | "mobile" | "databases" | "tools"}>
          {category.toUpperCase()}
        </Badge>
      )}

      {/* Breaking */}
      {breakingChange && (
        <Badge variant="red">BREAKING</Badge>
      )}

      {/* Date */}
      <span className="flex items-center gap-1.5 text-[var(--color-text-tertiary)]">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(releaseDate)}
      </span>

      {/* Impact */}
      {impactScore != null && impactScore > 0 && (
        <span className="flex items-center gap-1.5 text-[var(--color-text-tertiary)]">
          <Zap className="h-3.5 w-3.5" />
          Impact {impactScore}
        </span>
      )}

      {/* Spacer */}
      <span className="flex-1" />

      {/* Official link */}
      {officialUrl && /^https?:\/\//i.test(officialUrl) && (
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border-default)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <ExternalLink className="h-3 w-3" />
          Anuncio oficial
        </a>
      )}

      {/* Bookmark */}
      <BookmarkButton releaseId={releaseId} size="md" />

      {/* Share */}
      <ShareButton
        title={shareTitle}
        url={shareUrl}
        technology={technology}
        version={version}
      />
    </div>
  );
}
