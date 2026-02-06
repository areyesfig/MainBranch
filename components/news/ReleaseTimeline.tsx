"use client";

import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { ReleaseNote } from "@/types/release";
import { formatDate } from "@/lib/utils";

interface ReleaseTimelineProps {
  releases: ReleaseNote[];
}

/**
 * Timeline visual de releases históricos
 */
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
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 md:left-6" />

      <div className="space-y-8">
        {years.map((year) => (
          <div key={year} className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-bold text-white">
                {year}
              </span>
            </div>

            <div className="space-y-4">
              {groupedByYear[year].map((release, index) => (
                <Link
                  key={release.id}
                  href={`/releases/${release.id}`}
                  className="group relative flex gap-6 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
                >
                  {/* Nodo en la línea */}
                  <div className="relative z-10 flex shrink-0 items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white dark:bg-gray-900">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {release.technology} {release.version}
                      </h3>
                      {release.breakingChange && (
                        <span className="rounded px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200">
                          Breaking
                        </span>
                      )}
                    </div>
                    <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {release.tldr}
                    </p>
                    <time
                      dateTime={release.releaseDate.toString()}
                      className="text-xs text-gray-500 dark:text-gray-500"
                    >
                      {formatDate(release.releaseDate)}
                    </time>
                  </div>

                  {/* Flecha */}
                  <div className="flex shrink-0 items-center">
                    <ChevronRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-600" />
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
