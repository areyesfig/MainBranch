export const revalidate = 3600; // revalidar cada hora

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReleases } from "@/lib/data/releases";
import ReleaseTimeline from "@/components/news/ReleaseTimeline";

export default async function TimelinePage() {
  const releases = await getReleases();
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/releases"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Lanzamientos
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Timeline de Lanzamientos
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Vista cronológica de todos los releases por año
          </p>
        </div>

        <ReleaseTimeline releases={releases} />
      </div>
    </div>
  );
}
