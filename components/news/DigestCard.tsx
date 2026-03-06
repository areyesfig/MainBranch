import type { Digest } from "@/types/digest";
import { formatDateRange } from "@/lib/utils/dateRanges";
import { Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface DigestCardProps {
  digest: Digest;
}

export default function DigestCard({ digest }: DigestCardProps) {
  const periodLabel = digest.period === "weekly" ? "Semanal" : "Mensual";
  const dateRange = formatDateRange(digest.startDate, digest.endDate);

  // Extraer preview del contenido (primer párrafo)
  const preview = digest.content
    .replace(/^#{1,6}\s.*/gm, "") // quitar headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // quitar negritas
    .trim()
    .split("\n\n")[0]
    ?.slice(0, 200);

  return (
    <article className="group relative rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6 shadow-sm transition-all hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-[var(--radius-md)] px-2 py-1 text-xs font-semibold ${
                digest.period === "weekly"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              }`}
            >
              {periodLabel}
            </span>
            <span className="text-sm text-[var(--color-text-tertiary)]">
              {digest.releaseCount} releases
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
            <Calendar className="h-4 w-4" />
            <span>{dateRange}</span>
          </div>
        </div>
      </div>

      {/* Tecnologías */}
      {digest.technologies.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {digest.technologies.slice(0, 8).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]"
            >
              {tech}
            </span>
          ))}
          {digest.technologies.length > 8 && (
            <span className="text-xs text-[var(--color-text-tertiary)]">
              +{digest.technologies.length - 8} más
            </span>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <p className="mb-4 line-clamp-3 text-sm text-[var(--color-text-secondary)]">
          {preview}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-end border-t border-[var(--color-border-subtle)] pt-4">
        <Link
          href={`/digest/${digest.id}`}
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-brand)] transition-colors hover:opacity-80"
        >
          Leer digest
          <FileText className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
