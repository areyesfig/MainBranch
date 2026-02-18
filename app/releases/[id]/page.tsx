import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getReleaseById } from "@/lib/data/releases";
import { formatDate, sanitizeReleaseText } from "@/lib/utils";
import BreakingChangesDetail from "@/components/news/BreakingChangesDetail";
import MigrationGuide from "@/components/news/MigrationGuide";
import EcosystemImpact from "@/components/news/EcosystemImpact";
import VersionComparison from "@/components/news/VersionComparison";
import AIReleaseExplanation from "@/components/news/AIReleaseExplanation";

export const revalidate = 3600; // revalidar cada hora

interface PageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = "https://mainbranch.cl";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const release = await getReleaseById(id);

  if (!release) {
    return { title: "Release no encontrado" };
  }

  const title = `${release.technology} v${release.version}`;
  const description = release.tldr
    ? release.tldr.slice(0, 155)
    : `Notas de lanzamiento de ${release.technology} ${release.version}`;
  const url = `${SITE_URL}/releases/${id}`;
  const publishedTime =
    release.releaseDate instanceof Date
      ? release.releaseDate.toISOString()
      : release.releaseDate;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — Main Branch`,
      description,
      type: "article",
      url,
      publishedTime: publishedTime as string,
      tags: release.tags ?? [],
      section: release.category ?? "Technology",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Main Branch`,
      description,
    },
  };
}

export default async function ReleaseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const release = await getReleaseById(id);

  if (!release) {
    notFound();
  }

  // Limpiar textos para evitar ruido (markdown, URLs, referencias)
  const safe = (t: string | undefined | null, max = 10000) =>
    sanitizeReleaseText(t, max);
  const sanitizedTldr = safe(release.tldr);
  const sanitizedDescription = safe(release.description);
  const sanitizedFeatures = release.features?.map((f) => safe(f, 2000)) ?? [];
  const sanitizedImprovements =
    release.improvements?.map((f) => safe(f, 2000)) ?? [];
  const sanitizedBugFixes = release.bugFixes?.map((f) => safe(f, 2000)) ?? [];
  const sanitizedBreakingChanges =
    release.breakingChanges?.map((c) => safe(c, 2000)) ?? [];
  const sanitizedMigrationSteps =
    release.migrationSteps?.map((step) => ({
      ...step,
      title: safe(step.title, 200),
      description: safe(step.description, 2000),
      codeExample: step.codeExample ? safe(step.codeExample, 3000) : undefined,
    })) ?? [];

  const releaseDate =
    release.releaseDate instanceof Date
      ? release.releaseDate.toISOString()
      : release.releaseDate;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${release.technology} v${release.version} Release Notes`,
    description: release.tldr?.slice(0, 155),
    datePublished: releaseDate,
    dateModified: releaseDate,
    url: `${SITE_URL}/releases/${release.id}`,
    author: { "@type": "Organization", name: "Main Branch", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Main Branch", url: SITE_URL },
    keywords: [release.technology, release.version, ...(release.tags ?? [])].join(", "),
    ...(release.breakingChange && {
      about: { "@type": "Thing", name: "Breaking Changes" },
    }),
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/releases"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Lanzamientos
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {release.technology}
            </h1>
            <span className="rounded-md bg-blue-100 px-3 py-1 text-lg font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              v{release.version}
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Lanzado el {formatDate(release.releaseDate)}
          </p>
        </div>

        {/* TLDR */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
            Resumen (TLDR)
          </h2>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
            {sanitizedTldr}
          </p>
        </div>

        {/* Version Comparison */}
        {release.previousVersion && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <VersionComparison
              currentVersion={release.version}
              previousVersion={release.previousVersion}
              technology={release.technology}
              performanceMetrics={release.performanceMetrics}
              bundleSizeImpact={release.bundleSizeImpact}
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Descripción Detallada
          </h2>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
            {sanitizedDescription}
          </p>
        </div>

        {/* Explicación con IA */}
        <AIReleaseExplanation releaseId={release.id} />

        {/* Breaking Changes */}
        {release.breakingChange && sanitizedBreakingChanges.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <BreakingChangesDetail
              breakingChanges={sanitizedBreakingChanges}
              codeExamples={release.codeExamples}
            />
          </div>
        )}

        {/* Migration Guide */}
        {sanitizedMigrationSteps.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <MigrationGuide
              steps={sanitizedMigrationSteps}
              estimatedTotalTime={release.estimatedMigrationTime}
              complexity={release.migrationComplexity}
            />
          </div>
        )}

        {/* Ecosystem Impact */}
        {release.ecosystemImpact && release.ecosystemImpact.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <EcosystemImpact impacts={release.ecosystemImpact} />
          </div>
        )}

        {/* Features, Improvements, Bug Fixes */}
        <div className="grid gap-6 md:grid-cols-3">
          {sanitizedFeatures.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Nuevas Características
              </h3>
              <ul className="space-y-2">
                {sanitizedFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sanitizedImprovements.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Mejoras
              </h3>
              <ul className="space-y-2">
                {sanitizedImprovements.map((improvement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sanitizedBugFixes.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Correcciones
              </h3>
              <ul className="space-y-2">
                {sanitizedBugFixes.map((fix, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500"></span>
                    {fix}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Official Link — solo URLs http/https */}
        {release.officialUrl &&
          /^https?:\/\//i.test(release.officialUrl) && (
          <div className="mt-8 text-center">
            <a
              href={release.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Ver Anuncio Oficial
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
