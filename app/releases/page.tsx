import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Explora los últimos lanzamientos de React, Next.js, TypeScript, Node.js, IA y más de 30 tecnologías. Changelogs completos con breaking changes y features.",
  openGraph: {
    title: "Releases — Main Branch",
    description:
      "Últimos lanzamientos de las principales tecnologías del ecosistema JavaScript, TypeScript e IA.",
    url: `${SITE_URL}/releases`,
  },
  alternates: { canonical: `${SITE_URL}/releases` },
};

export const revalidate = 3600; // revalidar cada hora

import { Suspense } from "react";
import { getReleases } from "@/lib/data/releases";
import ReleasesClient from "./ReleasesClient";

export default async function ReleasesPage() {
  const releases = await getReleases();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-[var(--color-text-tertiary)]">Cargando...</p>
        </div>
      }
    >
      <ReleasesClient initialReleases={releases} />
    </Suspense>
  );
}
