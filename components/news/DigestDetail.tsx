"use client";

import type { Digest } from "@/types/digest";
import { formatDateRange } from "@/lib/utils/dateRanges";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Layers } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface DigestDetailProps {
  digest: Digest;
}

export default function DigestDetail({ digest }: DigestDetailProps) {
  const periodLabel = digest.period === "weekly" ? "Semanal" : "Mensual";
  const dateRange = formatDateRange(digest.startDate, digest.endDate);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 border-b border-[var(--color-border-default)] pb-6">
        <div className="mb-3 flex items-center gap-3">
          <span
            className={`rounded-[var(--radius-md)] px-3 py-1 text-sm font-semibold ${
              digest.period === "weekly"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
            }`}
          >
            Digest {periodLabel}
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-[var(--color-text-primary)]">
          Resumen {periodLabel}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dateRange}</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            <span>{digest.releaseCount} releases</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Generado el {formatDate(digest.generatedAt)}</span>
          </div>
        </div>

        {/* Tecnologías */}
        {digest.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {digest.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-[var(--color-bg-tertiary)] px-3 py-1 text-sm text-[var(--color-text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Contenido Markdown */}
      <div className="digest-content text-[var(--color-text-secondary)] [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--color-text-primary)] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--color-text-primary)] [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-[var(--color-text-primary)] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{digest.content}</ReactMarkdown>
      </div>
    </div>
  );
}
