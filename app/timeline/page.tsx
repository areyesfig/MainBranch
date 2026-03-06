import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

export const metadata: Metadata = {
  title: "Timeline de Releases",
  description:
    "Visualiza cronológicamente todos los lanzamientos de tecnologías. Navega por el historial de releases de React, Next.js, TypeScript y más.",
  openGraph: {
    title: "Timeline de Releases — Main Branch",
    description: "Historial cronológico de lanzamientos del ecosistema tech.",
    url: `${SITE_URL}/timeline`,
  },
  alternates: { canonical: `${SITE_URL}/timeline` },
};

export const revalidate = 3600; // revalidar cada hora

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReleases } from "@/lib/data/releases";
import ReleaseTimeline from "@/components/news/ReleaseTimeline";

export default async function TimelinePage() {
  const releases = await getReleases();
  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/releases"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Lanzamientos
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Timeline de Lanzamientos
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Vista cronológica de todos los releases por año
          </p>
        </div>

        <ReleaseTimeline releases={releases} />
      </div>
    </div>
  );
}
