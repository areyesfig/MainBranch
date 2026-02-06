"use client";

import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { RoadmapRelease } from "@/types/roadmap";

interface ReleaseRoadmapProps {
  releases: RoadmapRelease[];
}

const statusConfig = {
  planned: {
    icon: Calendar,
    label: "Planificado",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  beta: {
    icon: Clock,
    label: "Beta",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  rc: {
    icon: CheckCircle,
    label: "Release Candidate",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  delayed: {
    icon: AlertCircle,
    label: "Retrasado",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

/**
 * Componente para mostrar el roadmap de próximos releases
 */
export default function ReleaseRoadmap({ releases }: ReleaseRoadmapProps) {
  const sortedReleases = [...releases].sort((a, b) => {
    const statusOrder = { rc: 0, beta: 1, planned: 2, delayed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Roadmap de Próximos Releases
      </h2>
      <div className="space-y-4">
        {sortedReleases.map((release) => {
          const config = statusConfig[release.status];
          const Icon = config.icon;
          return (
            <div
              key={release.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {release.technology} {release.version}
                </h3>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
                >
                  <Icon className="h-4 w-4" />
                  {config.label}
                </span>
                {release.expectedDate && (
                  <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {release.expectedDate}
                  </span>
                )}
              </div>
              {release.description && (
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {release.description}
                </p>
              )}
              {release.features && release.features.length > 0 && (
                <ul className="space-y-1">
                  {release.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
