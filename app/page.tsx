import Link from "next/link";
import ReleaseCard from "@/components/news/ReleaseCard";
import SecurityAlerts from "@/components/news/SecurityAlerts";
import { getReleases } from "@/lib/data/releases";
import { isPlaceholderVersion } from "@/lib/utils";
import { ArrowRight, Bot, Rss, Sparkles } from "lucide-react";

export default async function Home() {
  const releases = await getReleases();
  const withRealVersion = (r: { version?: string }) => !isPlaceholderVersion(r.version);

  // Mostrar los 3 releases más recientes (excluir v0.0.0)
  const featuredReleases = releases
    .filter(withRealVersion)
    .sort((a, b) => {
      const dateA = new Date(a.releaseDate).getTime();
      const dateB = new Date(b.releaseDate).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);

  // Releases de IA/ML y LLMs (excluir v0.0.0)
  const aiReleases = releases
    .filter(withRealVersion)
    .filter((r) => r.category === "ai-ml" || r.category === "llms")
    .sort((a, b) => {
      const dateA = new Date(a.releaseDate).getTime();
      const dateB = new Date(b.releaseDate).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Sparkles className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Main Branch
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            Mantente al día con los últimos lanzamientos y actualizaciones de
            las tecnologías más importantes del ecosistema de desarrollo.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/releases"
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Ver Todos los Lanzamientos
            </Link>
            <Link
              href="/about"
              className="text-base font-semibold leading-6 text-gray-900 transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
            >
              Saber más <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              <Rss className="h-5 w-5" />
              RSS Feed
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Releases */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Lanzamientos Recientes
          </h2>
          <Link
            href="/releases"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredReleases.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No hay lanzamientos disponibles en este momento.
            </p>
          </div>
        )}
      </div>

      {/* AI/ML Section */}
      {aiReleases.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              IA y Machine Learning
            </h2>
            <Link
              href="/releases?category=ai-ml"
              className="flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Ver IA/ML y LLMs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {aiReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </div>
      )}

      {/* Security Alerts */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SecurityAlerts releases={releases} />
      </div>

      {/* Quick Links */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Link
          href="/timeline"
          className="group block max-w-md rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Timeline de Releases
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Vista cronológica de todos los lanzamientos por año
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
            Ver timeline <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}
