import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { resources, RESOURCE_CATEGORIES } from "@/lib/resources/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Herramientas, plataformas y recursos recomendados para developers. Hosting, IDEs, cursos, APIs y más.",
  openGraph: {
    title: "Recursos — Main Branch",
    description: "Herramientas y recursos recomendados para developers.",
    url: `${SITE_URL}/recursos`,
  },
  alternates: { canonical: `${SITE_URL}/recursos` },
};

const CATEGORY_COLORS: Record<string, string> = {
  Hosting: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "IDEs & Editores": "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Aprendizaje: "bg-green-500/10 text-green-600 dark:text-green-400",
  "APIs & Backend": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "Bases de Datos": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  "DevOps & CI/CD": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "Diseño & UI": "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "Herramientas Dev": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default function RecursosPage() {
  return (
    <div className="animate-fade-in py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Recursos para Developers
          </h1>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-2xl">
            Una selección curada de herramientas, plataformas y recursos que usamos
            y recomendamos para desarrollo web moderno.
          </p>
        </div>

        {/* Categories */}
        {RESOURCE_CATEGORIES.map((category) => {
          const items = resources.filter((r) => r.category === category);
          if (items.length === 0) return null;

          return (
            <section key={category} className="mb-12">
              <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                {category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5 transition-all hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)]">
                        {resource.name}
                      </h3>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="mt-2 flex-1 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {resource.description}
                    </p>
                    <span
                      className={`mt-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium ${CATEGORY_COLORS[resource.category] ?? "bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]"}`}
                    >
                      {resource.category}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
