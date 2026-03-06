import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReleaseById } from "@/lib/data/releases";
import dynamic from "next/dynamic";
import CompareSelector from "@/components/news/CompareSelector";

const ReleaseCompare = dynamic(() => import("@/components/news/ReleaseCompare"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6">
          <div className="h-6 w-32 rounded bg-[var(--color-bg-tertiary)]" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-[var(--color-bg-tertiary)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--color-bg-tertiary)]" />
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6">
          <div className="h-6 w-32 rounded bg-[var(--color-bg-tertiary)]" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-[var(--color-bg-tertiary)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--color-bg-tertiary)]" />
          </div>
        </div>
      </div>
    </div>
  ),
});

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { a, b } = await searchParams;

  if (!a || !b) {
    return {
      title: "Comparar Releases — Main Branch",
      description: "Compara dos releases lado a lado para entender qué cambió entre versiones.",
    };
  }

  const [releaseA, releaseB] = await Promise.all([
    getReleaseById(a),
    getReleaseById(b),
  ]);

  if (!releaseA || !releaseB) {
    return { title: "Release no encontrado — Main Branch" };
  }

  const title = `${releaseA.technology} v${releaseA.version} vs ${releaseB.technology} v${releaseB.version}`;
  const description = `Comparación entre ${releaseA.technology} v${releaseA.version} y ${releaseB.technology} v${releaseB.version}.`;

  return {
    title: `${title} — Main Branch`,
    description,
    alternates: { canonical: `${SITE_URL}/releases/compare?a=${a}&b=${b}` },
    openGraph: {
      title: `${title} — Main Branch`,
      description,
      type: "article",
      url: `${SITE_URL}/releases/compare?a=${a}&b=${b}`,
    },
  };
}

export default async function CompareReleasesPage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;

  if (!a || !b) {
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

          <h1 className="mb-6 text-3xl font-bold text-[var(--color-text-primary)]">
            Comparar Releases
          </h1>
          <p className="mb-6 text-[var(--color-text-secondary)]">
            Selecciona dos releases para compararlos lado a lado.
          </p>
          <CompareSelector />
        </div>
      </div>
    );
  }

  const [releaseA, releaseB] = await Promise.all([
    getReleaseById(a),
    getReleaseById(b),
  ]);

  if (!releaseA || !releaseB) {
    const missing = !releaseA ? a : b;
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

          <div className="rounded-[var(--radius-lg)] border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
            <h1 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">
              Release no encontrado
            </h1>
            <p className="text-sm text-red-700 dark:text-red-300">
              No se encontró el release con ID <code className="font-mono">{missing}</code>.
            </p>
          </div>

          <div className="mt-6">
            <CompareSelector currentA={releaseA ? a : undefined} currentB={releaseB ? b : undefined} />
          </div>
        </div>
      </div>
    );
  }

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

        <h1 className="mb-6 text-3xl font-bold text-[var(--color-text-primary)]">
          Comparar Releases
        </h1>

        <div className="mb-8">
          <CompareSelector currentA={a} currentB={b} />
        </div>

        <ReleaseCompare releaseA={releaseA} releaseB={releaseB} />
      </div>
    </div>
  );
}
