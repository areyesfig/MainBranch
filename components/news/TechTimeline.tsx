import Link from "next/link";
import { Calendar, ChevronRight, AlertTriangle } from "lucide-react";
import type { ReleaseNote } from "@/types/release";
import { formatDate, sanitizeReleaseText } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface TechTimelineProps {
  releases: ReleaseNote[];
}

function groupByYear(releases: ReleaseNote[]): Record<string, ReleaseNote[]> {
  const groups: Record<string, ReleaseNote[]> = {};
  for (const r of releases) {
    const year = new Date(r.releaseDate).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(r);
  }
  return groups;
}

export default function TechTimeline({ releases }: TechTimelineProps) {
  const sorted = [...releases].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );
  const grouped = groupByYear(sorted);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

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
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {grouped[year].length} release{grouped[year].length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3">
              {grouped[year].map((release) => (
                <Link
                  key={release.id}
                  href={`/releases/${release.id}`}
                  className="group relative ml-2 flex gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700 md:ml-4"
                >
                  {/* Nodo */}
                  <div className="relative z-10 flex shrink-0 items-center justify-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white dark:bg-gray-900 ${
                        release.breakingChange
                          ? "border-red-500"
                          : "border-blue-600"
                      }`}
                    >
                      {release.breakingChange ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Calendar className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {release.technology}
                      </h3>
                      <Badge variant="blue">v{release.version}</Badge>
                      {release.breakingChange && (
                        <Badge variant="red">Breaking</Badge>
                      )}
                      {release.impactScore != null && release.impactScore > 0 && (
                        <Badge
                          variant={
                            release.impactScore >= 70
                              ? "red"
                              : release.impactScore >= 40
                                ? "yellow"
                                : "green"
                          }
                        >
                          {release.impactScore}
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {sanitizeReleaseText(release.tldr, 200)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                      <time dateTime={release.releaseDate.toString()}>
                        {formatDate(release.releaseDate)}
                      </time>
                      {release.features && release.features.length > 0 && (
                        <span>{release.features.length} features</span>
                      )}
                      {release.bugFixes && release.bugFixes.length > 0 && (
                        <span>{release.bugFixes.length} fixes</span>
                      )}
                    </div>
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
