import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getReleasesByStack } from "@/lib/data/releases";
import { getStackLabel, STACK_LABELS } from "@/lib/stackLabels";
import { getCategoryLabel } from "@/lib/categories";
import TechStats from "@/components/news/TechStats";
import TechTimeline from "@/components/news/TechTimeline";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(STACK_LABELS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const label = getStackLabel(slug);

  if (!STACK_LABELS[slug]) {
    return { title: "Tecnología no encontrada — Main Branch" };
  }

  const description = `Dashboard de ${label}: timeline de releases, breaking changes, frecuencia de actualización e impact score.`;

  return {
    title: `${label} — Main Branch`,
    description,
    alternates: { canonical: `${SITE_URL}/tech/${slug}` },
    openGraph: {
      title: `${label} — Main Branch`,
      description,
      url: `${SITE_URL}/tech/${slug}`,
    },
  };
}

function computeStats(releases: Awaited<ReturnType<typeof getReleasesByStack>>) {
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentReleases = releases.filter(
    (r) => new Date(r.releaseDate) >= sixMonthsAgo
  );

  const totalReleases = releases.length;
  const recentCount = recentReleases.length;
  const breakingCount = recentReleases.filter((r) => r.breakingChange).length;
  const totalBreaking = releases.filter((r) => r.breakingChange).length;

  const scores = releases
    .map((r) => r.impactScore)
    .filter((s): s is number => s != null && s > 0);
  const avgImpact =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const dates = releases.map((r) => new Date(r.releaseDate).getTime()).sort();
  let avgDaysBetween = 0;
  if (dates.length >= 2) {
    const gaps: number[] = [];
    for (let i = 1; i < dates.length; i++) {
      gaps.push((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24));
    }
    avgDaysBetween = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  }

  const latestRelease = releases[0] ?? null;
  const category = releases.find((r) => r.category)?.category ?? null;
  const technologies = [...new Set(releases.map((r) => r.technology))];

  return {
    totalReleases,
    recentCount,
    breakingCount,
    totalBreaking,
    avgImpact,
    avgDaysBetween,
    latestRelease,
    category,
    technologies,
  };
}

export default async function TechDashboardPage({ params }: PageProps) {
  const { slug } = await params;

  if (!STACK_LABELS[slug]) {
    notFound();
  }

  const label = getStackLabel(slug);
  const releases = await getReleasesByStack(slug);
  const stats = computeStats(releases);

  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/releases"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Lanzamientos
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
              {label}
            </h1>
            {stats.category && (
              <span className="rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] px-3 py-1 text-sm font-medium text-[var(--color-text-secondary)]">
                {getCategoryLabel(stats.category)}
              </span>
            )}
          </div>
          {stats.technologies.length > 1 && (
            <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
              Incluye: {stats.technologies.join(", ")}
            </p>
          )}
        </div>

        {releases.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-12 text-center">
            <p className="text-lg text-[var(--color-text-secondary)]">
              No hay releases registrados para {label}.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <TechStats
              label={label}
              totalReleases={stats.totalReleases}
              recentCount={stats.recentCount}
              breakingCount={stats.breakingCount}
              totalBreaking={stats.totalBreaking}
              avgImpact={stats.avgImpact}
              avgDaysBetween={stats.avgDaysBetween}
              latestVersion={stats.latestRelease?.version}
              latestDate={stats.latestRelease?.releaseDate}
            />

            {/* Timeline */}
            <div className="mt-8">
              <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
                Timeline de Releases
              </h2>
              <TechTimeline releases={releases} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
