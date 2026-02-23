"use client";

import type { NewsArticle } from "@/types/news";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Calendar, User, MessageSquare } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getTopicLabel } from "@/lib/topicLabels";
import ShareButton from "@/components/news/ShareButton";

interface NewsCardProps {
  article: NewsArticle;
  lang?: "en" | "es";
}

const TOPIC_VARIANTS: Record<string, "green" | "orange" | "blue" | "purple" | "gray" | "yellow" | "red"> = {
  openai: "green",
  claude: "orange",
  gemini: "blue",
  deepseek: "purple",
  grok: "gray",
  mistral: "yellow",
  meta: "blue",
  copilot: "gray",
  apple: "gray",
  nvidia: "green",
  "general-ai": "gray",
};

const TOPIC_ACCENT: Record<string, string> = {
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

export default function NewsCard({ article, lang = "es" }: NewsCardProps) {
  const topicVariant = TOPIC_VARIANTS[article.topic ?? ""] ?? "gray";
  const accentColor = TOPIC_ACCENT[article.topic ?? ""] ?? "bg-gray-400";

  const displayTitle = lang === "es" && article.titleEs ? article.titleEs : article.title;
  const displaySummary = lang === "es" && article.summaryEs ? article.summaryEs : article.summary;

  return (
    <article className="group relative rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {/* Topic accent bar */}
      <div className={`h-0.5 rounded-t-lg ${accentColor}`} />

      <div className="p-6">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-snug text-gray-900 line-clamp-2 dark:text-white">
            {displayTitle}
          </h3>
        </div>

        {/* Topic + Source */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {article.topic && (
            <Badge variant={topicVariant}>{getTopicLabel(article.topic)}</Badge>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-3 w-3" />
            {article.sourceName}
          </span>
        </div>

        {/* Summary */}
        <p className="mb-4 text-sm text-gray-700 line-clamp-3 dark:text-gray-300">
          {displaySummary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={article.publishedAt.toString()}>
                {formatDate(article.publishedAt)}
              </time>
            </span>
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {article.author}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ShareButton
              title={displayTitle}
              url={article.sourceUrl}
              shareText={displayTitle}
            />
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Leer más
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
