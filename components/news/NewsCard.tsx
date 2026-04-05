"use client";

import type { NewsArticle } from "@/types/news";
import { formatDate } from "@/lib/utils";
import { getTopicLabel } from "@/lib/topicLabels";

interface NewsCardProps {
  article: NewsArticle;
  lang?: "en" | "es";
  isActive?: boolean;
}

const TOPIC_BADGE_COLORS: Record<string, string> = {
  openai: "bg-green-500",
  claude: "bg-orange-500",
  gemini: "bg-blue-500",
  deepseek: "bg-purple-500",
  grok: "bg-gray-500",
  mistral: "bg-yellow-500",
  meta: "bg-indigo-500",
  copilot: "bg-gray-600",
  apple: "bg-slate-600",
  nvidia: "bg-green-600",
  "general-ai": "bg-slate-500",
};

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function NewsCard({ article, lang = "es", isActive }: NewsCardProps) {
  const badgeColor = TOPIC_BADGE_COLORS[article.topic ?? ""] ?? "bg-slate-500";
  const displayTitle = lang === "es" && article.titleEs ? article.titleEs : article.title;
  const readTime = estimateReadingTime(article.content || article.summary || "");

  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block overflow-hidden rounded-xl border bg-[var(--color-bg-elevated)] transition-all hover:-translate-y-1 hover:shadow-lg ${
        isActive
          ? "border-[var(--color-brand)] ring-2 ring-[var(--color-brand)]"
          : "border-[var(--color-border-default)]"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-tertiary)]">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
            <svg
              className="h-12 w-12 text-slate-400 dark:text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Topic badge */}
        {article.topic && (
          <span
            className={`mb-3 inline-block rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white ${badgeColor}`}
          >
            {getTopicLabel(article.topic)}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-3 text-base font-bold leading-snug text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-brand)] transition-colors">
          {displayTitle}
        </h3>

        {/* Meta */}
        <div className="space-y-0.5 text-xs text-[var(--color-text-tertiary)]">
          {article.author && (
            <p>Por {article.author}</p>
          )}
          <p>{formatDate(article.publishedAt)}</p>
          <p>{readTime} min de lectura</p>
        </div>
      </div>
    </a>
  );
}
