"use client";

import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { ReleaseNote } from "@/types/release";
import { formatDate } from "@/lib/utils";

interface ReleaseTimelineProps {
  releases: ReleaseNote[];
}

export default function ReleaseTimeline({ releases }: ReleaseTimelineProps) {
  const sortedReleases = [...releases].sort((a, b) => {
    const dateA = new Date(a.releaseDate).getTime();
    const dateB = new Date(b.releaseDate).getTime();
    return dateB - dateA;
  });

  const groupedByYear = sortedReleases.reduce<Record<string, ReleaseNote[]>>(
    (acc, release) => {
      const year = new Date(release.releaseDate).getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(release);
      return acc;
    },
    {}
  );

  const years = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="relative">
      {/* Línea vertical */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--color-border-default)] md:left-6" />

      <div className="space-y-8">
        {years.map((year) => (
          <div key={year} className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-[var(--color-brand)] px-4 py-1 text-sm font-bold text-white">
                {year}
              </span>
            </div>

            <div className="space-y-4">
              {groupedByYear[year].map((release) => (
                <Link
                  key={release.id}
                  href={`/releases/${release.id}`}
                  className="group relative flex gap-6 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4 transition-all hover:border-[var(--color-brand)] hover:shadow-md"
                >
                  {/* Nodo en la línea */}
                  <div className="relative z-10 flex shrink-0 items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-brand)] bg-[var(--color-bg-elevated)]">
                      <Calendar className="h-4 w-4 text-[var(--color-brand)]" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--color-text-primary)]">
                        {release.technology} {release.version}
                      </h3>
                      {release.breakingChange && (
                        <span className="rounded px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200">
                          Breaking
                        </span>
                      )}
                    </div>
                    <p className="mb-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                      {release.tldr}
                    </p>
                    <time
                      dateTime={release.releaseDate.toString()}
                      className="text-xs text-[var(--color-text-tertiary)]"
                    >
                      {formatDate(release.releaseDate)}
                    </time>
                  </div>

                  {/* Flecha */}
                  <div className="flex shrink-0 items-center">
                    <ChevronRight className="h-5 w-5 text-[var(--color-text-tertiary)] transition-colors group-hover:text-[var(--color-brand)]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
