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
    <article className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-md px-2 py-1 text-xs font-semibold ${
                digest.period === "weekly"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              }`}
            >
              {periodLabel}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {digest.releaseCount} releases
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
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
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
          {digest.technologies.length > 8 && (
            <span className="text-xs text-gray-500">
              +{digest.technologies.length - 8} más
            </span>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <p className="mb-4 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
          {preview}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-end border-t border-gray-200 pt-4 dark:border-gray-800">
        <Link
          href={`/digest/${digest.id}`}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Leer digest
          <FileText className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
