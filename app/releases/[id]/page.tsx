import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReleaseById, getRelatedReleases } from "@/lib/data/releases";
import { formatDate, sanitizeReleaseText } from "@/lib/utils";
import dynamic from "next/dynamic";
import BreakingChangesDetail from "@/components/news/BreakingChangesDetail";
import EcosystemImpact from "@/components/news/EcosystemImpact";
import VersionComparison from "@/components/news/VersionComparison";

const MigrationGuide = dynamic(() => import("@/components/news/MigrationGuide"), {
  loading: () => (
    <div className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6">
      <div className="h-5 w-40 rounded bg-[var(--color-bg-tertiary)]" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-full rounded bg-[var(--color-bg-tertiary)]" />
        <div className="h-4 w-3/4 rounded bg-[var(--color-bg-tertiary)]" />
      </div>
    </div>
  ),
});

const AIReleaseExplanation = dynamic(() => import("@/components/news/AIReleaseExplanation"), {
  loading: () => (
    <div className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6">
      <div className="h-5 w-48 rounded bg-[var(--color-bg-tertiary)]" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-[var(--color-bg-tertiary)]" />
        <div className="h-4 w-5/6 rounded bg-[var(--color-bg-tertiary)]" />
      </div>
    </div>
  ),
});

const AISummaryCard = dynamic(() => import("@/components/news/AISummaryCard"));
import ArticleMeta from "@/components/article/ArticleMeta";
import ArticleSummary from "@/components/article/ArticleSummary";
import ReadingProgress from "@/components/article/ReadingProgress";
import RelatedReleases from "@/components/news/RelatedReleases";
import { ADS_CONFIG, AD_SLOTS } from "@/lib/ads/config";
import InArticleAd from "@/components/ads/InArticleAd";
import ReleaseBottomAd from "@/components/ads/ReleaseBottomAd";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "var(--color-cat-frontend)",
  backend: "var(--color-cat-backend)",
  "ai-ml": "var(--color-cat-ai-ml)",
  llms: "var(--color-cat-llms)",
  devops: "var(--color-cat-devops)",
  mobile: "var(--color-cat-mobile)",
  databases: "var(--color-cat-databases)",
  tools: "var(--color-cat-tools)",
};

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

  const relatedReleases = await getRelatedReleases(release, 4);

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

  const accentColor =
    CATEGORY_COLORS[release.category ?? ""] ?? "var(--color-brand)";

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
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="animate-fade-in py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Back */}
          <Link
            href="/releases"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Releases
          </Link>

          {/* Overline */}
          <p
            className="overline mb-3"
            style={{ color: accentColor }}
          >
            {release.category?.toUpperCase() ?? "RELEASE"}
          </p>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl leading-tight">
            {release.technology}{" "}
            <span className="text-[var(--color-text-tertiary)]">
              v{release.version}
            </span>
          </h1>

          {/* Meta bar */}
          <div className="mt-4 mb-8">
            <ArticleMeta
              releaseId={release.id}
              category={release.category}
              releaseDate={release.releaseDate}
              impactScore={release.impactScore}
              breakingChange={release.breakingChange}
              officialUrl={release.officialUrl}
              shareTitle={
                release.tldr ??
                `Notas de lanzamiento de ${release.technology} ${release.version}`
              }
              shareUrl={`${SITE_URL}/releases/${release.id}`}
              technology={release.technology}
              version={release.version}
            />
          </div>

          {/* In-article Ad */}
          {ADS_CONFIG.enabled && AD_SLOTS.inArticle.id && (
            <div className="mt-6">
              <InArticleAd />
            </div>
          )}

          {/* TLDR Summary */}
          <ArticleSummary
            tldr={sanitizedTldr}
            features={sanitizedFeatures.slice(0, 5)}
            accentColor={accentColor}
          />

          {/* Version Comparison */}
          {release.previousVersion && (
            <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
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
          {sanitizedDescription && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-[var(--color-text-primary)]">
                Descripción Detallada
              </h2>
              <p className="whitespace-pre-line text-[var(--color-text-secondary)] leading-relaxed">
                {sanitizedDescription}
              </p>
            </div>
          )}

          {/* AI Summary (structured, pre-generated) or on-demand explanation */}
          <div className="mt-8">
            {release.aiSummary ? (
              <AISummaryCard
                summary={release.aiSummary}
                rawDescription={sanitizedDescription || undefined}
              />
            ) : (
              <AIReleaseExplanation releaseId={release.id} />
            )}
          </div>

          {/* Breaking Changes */}
          {release.breakingChange && sanitizedBreakingChanges.length > 0 && (
            <div className="mt-8 rounded-[var(--radius-lg)] border border-red-500/20 bg-[var(--color-bg-elevated)] p-5 sm:p-6">
              <BreakingChangesDetail
                breakingChanges={sanitizedBreakingChanges}
                codeExamples={release.codeExamples}
              />
            </div>
          )}

          {/* Migration Guide */}
          {sanitizedMigrationSteps.length > 0 && (
            <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
              <MigrationGuide
                steps={sanitizedMigrationSteps}
                estimatedTotalTime={release.estimatedMigrationTime}
                complexity={release.migrationComplexity}
              />
            </div>
          )}

          {/* Ecosystem Impact */}
          {release.ecosystemImpact && release.ecosystemImpact.length > 0 && (
            <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
              <EcosystemImpact impacts={release.ecosystemImpact} />
            </div>
          )}

          {/* Features, Improvements, Bug Fixes */}
          {(sanitizedFeatures.length > 0 ||
            sanitizedImprovements.length > 0 ||
            sanitizedBugFixes.length > 0) && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sanitizedFeatures.length > 0 && (
                <DetailList
                  title="Nuevas Caracteristicas"
                  items={sanitizedFeatures}
                  dotColor="var(--color-brand)"
                />
              )}

              {sanitizedImprovements.length > 0 && (
                <DetailList
                  title="Mejoras"
                  items={sanitizedImprovements}
                  dotColor="var(--color-success)"
                />
              )}

              {sanitizedBugFixes.length > 0 && (
                <DetailList
                  title="Correcciones"
                  items={sanitizedBugFixes}
                  dotColor="var(--color-cat-devops)"
                />
              )}
            </div>
          )}

          {/* Tags */}
          {release.tags && release.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {release.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-xs text-[var(--color-text-tertiary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Releases */}
          <RelatedReleases releases={relatedReleases} />

          {/* Bottom Ad */}
          {ADS_CONFIG.enabled && AD_SLOTS.releaseBottom.id && (
            <div className="mt-8">
              <ReleaseBottomAd />
            </div>
          )}
        </div>
      </article>
    </>
  );
}

function DetailList({
  title,
  items,
  dotColor,
}: {
  title: string;
  items: string[];
  dotColor: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5">
      <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: dotColor }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
