import type { Metadata } from "next";
import Link from "next/link";
import { STACK_LABELS } from "@/lib/stackLabels";
import { getReleases } from "@/lib/data/releases";
import Badge from "@/components/ui/Badge";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

export const metadata: Metadata = {
  title: "Tecnologías — Main Branch",
  description:
    "Explora dashboards de cada tecnología: releases, breaking changes, frecuencia de actualización y más.",
  alternates: { canonical: `${SITE_URL}/tech` },
  openGraph: {
    title: "Tecnologías — Main Branch",
    description:
      "Dashboards por tecnología con estadísticas de releases y breaking changes.",
    url: `${SITE_URL}/tech`,
  },
};

export default async function TechIndexPage() {
  const releases = await getReleases();

  // Contar releases por stack
  const countByStack: Record<string, number> = {};
  const breakingByStack: Record<string, number> = {};
  for (const r of releases) {
    if (!r.stack) continue;
    countByStack[r.stack] = (countByStack[r.stack] ?? 0) + 1;
    if (r.breakingChange) {
      breakingByStack[r.stack] = (breakingByStack[r.stack] ?? 0) + 1;
    }
  }

  // Ordenar por cantidad de releases DESC
  const stacks = Object.keys(STACK_LABELS).sort(
    (a, b) => (countByStack[b] ?? 0) - (countByStack[a] ?? 0)
  );

  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Tecnologías
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
            Explora el dashboard de cada tecnología con estadísticas, timeline y breaking changes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stacks.map((slug, i) => {
            const count = countByStack[slug] ?? 0;
            const breaking = breakingByStack[slug] ?? 0;

            return (
              <Link
                key={slug}
                href={`/tech/${slug}`}
                className="group animate-slide-up rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand)] hover:shadow-md"
                style={i < 20 ? { animationDelay: `${i * 50}ms` } : undefined}
              >
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)]">
                  {STACK_LABELS[slug]}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {count > 0 ? (
                    <Badge variant="blue">{count} releases</Badge>
                  ) : (
                    <Badge variant="gray">Sin releases</Badge>
                  )}
                  {breaking > 0 && (
                    <Badge variant="red">{breaking} breaking</Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

