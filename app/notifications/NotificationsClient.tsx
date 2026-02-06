"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, Rss, Settings } from "lucide-react";
import { useNotificationPreferences } from "@/contexts/NotificationContext";
import type { ReleaseNote } from "@/types/release";
import { isPlaceholderVersion } from "@/lib/utils";
import ReleaseCard from "@/components/news/ReleaseCard";
import NotificationPreferences from "@/components/ui/NotificationPreferences";
import { getStackLabel } from "@/lib/stackLabels";

interface NotificationsClientProps {
  initialReleases: ReleaseNote[];
}

export default function NotificationsClient({
  initialReleases,
}: NotificationsClientProps) {
  const { selectedStacks } = useNotificationPreferences();
  const [showPreferences, setShowPreferences] = useState(false);

  const releases = useMemo(() => {
    if (!selectedStacks.length) return [];
    return initialReleases.filter(
      (r) =>
        !isPlaceholderVersion(r.version) &&
        r.stack &&
        selectedStacks.includes(r.stack)
    );
  }, [initialReleases, selectedStacks]);

  const sortedReleases = useMemo(() => {
    return [...releases].sort((a, b) => {
      const dateA = new Date(a.releaseDate).getTime();
      const dateB = new Date(b.releaseDate).getTime();
      return dateB - dateA;
    });
  }, [releases]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
              <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              Tus Notificaciones
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Lanzamientos de tus stacks favoritos
            </p>
          </div>
          <button
            onClick={() => setShowPreferences(true)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
            Configurar stacks
          </button>
        </div>

        {/* Selected Stacks Summary */}
        {selectedStacks.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Stacks seleccionados ({selectedStacks.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedStacks.map((stack) => (
                  <span
                    key={stack}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {getStackLabel(stack)}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Rss className="h-4 w-4" />
                RSS Feed personalizado
              </h3>
              <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                Añade esta URL a tu lector de RSS para recibir solo releases de tus stacks:
              </p>
              <code className="block break-all rounded bg-gray-100 px-2 py-2 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/feed?stack=${selectedStacks.join(",")}`
                  : `/feed?stack=${selectedStacks.join(",")}`}
              </code>
            </div>
          </div>
        )}

        {/* Content */}
        {selectedStacks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <Bell className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Configura tus notificaciones
            </h2>
            <p className="mb-6 mx-auto max-w-md text-gray-600 dark:text-gray-400">
              Selecciona los stacks tecnológicos que te interesan para ver aquí
              solo los lanzamientos relevantes para ti.
            </p>
            <button
              onClick={() => setShowPreferences(true)}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Seleccionar stacks
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : sortedReleases.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400">
              No hay lanzamientos para tus stacks seleccionados en este momento.
            </p>
            <Link
              href="/releases"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ver todos los lanzamientos
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {sortedReleases.length} lanzamiento{sortedReleases.length !== 1 ? "s" : ""}{" "}
              para tus stacks
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {sortedReleases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/releases"
                className="inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Ver todos los lanzamientos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Modal de preferencias */}
        {showPreferences && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowPreferences(false)}
          >
            <div
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <NotificationPreferences
                variant="inline"
                onClose={() => setShowPreferences(false)}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
