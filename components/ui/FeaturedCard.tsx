import type { ReleaseNote } from "@/types/release";
import type { NewsArticle } from "@/types/news";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type FeaturedCardProps =
  | { type: "release"; data: ReleaseNote }
  | { type: "news"; data: NewsArticle };

export default function FeaturedCard(props: FeaturedCardProps) {
  const isRelease = props.type === "release";
  const gradientClass = isRelease
    ? "from-blue-600 to-violet-600"
    : "from-purple-600 to-pink-600";

  if (isRelease) {
    const release = props.data;
    return (
      <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className={`h-1 bg-gradient-to-r ${gradientClass}`} />
        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="blue" size="sm">Release</Badge>
            {release.breakingChange && (
              <Badge variant="red" size="xs">Breaking</Badge>
            )}
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {release.technology} v{release.version}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
            {release.tldr}
          </p>
          <div className="flex items-center justify-between">
            <time className="text-xs text-gray-500 dark:text-gray-400" dateTime={release.releaseDate.toString()}>
              {formatDate(release.releaseDate)}
            </time>
            <Link
              href={`/releases/${release.id}`}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ver detalles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const article = props.data;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className={`h-1 bg-gradient-to-r ${gradientClass}`} />
      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="purple" size="sm">Noticia AI</Badge>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2 dark:text-white">
          {article.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <time className="text-xs text-gray-500 dark:text-gray-400" dateTime={article.publishedAt.toString()}>
            {formatDate(article.publishedAt)}
          </time>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-purple-600 transition-colors hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Leer más
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
