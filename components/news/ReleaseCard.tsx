import { ReleaseNote } from "@/types/release";
import { formatDate, sanitizeReleaseText } from "@/lib/utils";
import { ExternalLink, AlertTriangle, Calendar, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";
import VoteButton from "@/components/news/VoteButton";

function ImpactBadge({ score }: { score?: number }) {
  if (score == null || score === 0) return null;

  if (score >= 70) {
    return (
      <span className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
        <TrendingUp className="h-3 w-3" />
        Alto impacto
      </span>
    );
  }
  if (score >= 40) {
    return (
      <span className="flex items-center gap-1 rounded-md bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
        <TrendingUp className="h-3 w-3" />
        Medio impacto
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
      <TrendingUp className="h-3 w-3" />
      Bajo impacto
    </span>
  );
}

interface ReleaseCardProps {
  release: ReleaseNote;
}

/**
 * Componente para mostrar una tarjeta de lanzamiento
 */
export default function ReleaseCard({ release }: ReleaseCardProps) {
  const isBreakingChange = release.breakingChange;

  return (
    <article className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {release.technology}
            </h3>
            <span className="rounded-md bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              v{release.version}
            </span>
            {isBreakingChange && (
              <span className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                <AlertTriangle className="h-3 w-3" />
                Breaking Changes
              </span>
            )}
            <ImpactBadge score={release.impactScore} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={release.releaseDate.toString()}>
                {formatDate(release.releaseDate)}
              </time>
            </div>
          </div>
        </div>
      </div>

      {/* TLDR: texto limpio y contenido en el recuadro */}
      <p className="mb-4 line-clamp-4 break-words text-gray-700 dark:text-gray-300">
        {sanitizeReleaseText(release.tldr)}
      </p>

      {/* Features Preview */}
      {release.features && release.features.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            Nuevas Características:
          </h4>
          <ul className="space-y-1">
            {release.features.slice(0, 3).map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                {feature}
              </li>
            ))}
            {release.features.length > 3 && (
              <li className="text-xs text-gray-500 dark:text-gray-500">
                +{release.features.length - 3} más...
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Tags */}
      {release.tags && release.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {release.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          {release.improvements && release.improvements.length > 0 && (
            <span>{release.improvements.length} mejoras</span>
          )}
          {release.bugFixes && release.bugFixes.length > 0 && (
            <span>{release.bugFixes.length} correcciones</span>
          )}
          <VoteButton releaseId={release.id} initialVotes={release.votes ?? 0} />
        </div>
        <Link
          href={`/releases/${release.id}`}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Ver detalles
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
