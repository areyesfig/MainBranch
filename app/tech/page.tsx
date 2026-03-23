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

const STACK_CATEGORY: Record<string, string> = {
  nextjs: "frontend", react: "frontend", vue: "frontend", svelte: "frontend",
  astro: "frontend", nuxt: "frontend", remix: "frontend", vite: "tools",
  typescript: "frontend", tailwind: "frontend",
  nodejs: "backend", deno: "backend", rust: "backend", go: "backend",
  pytorch: "ai-ml", huggingface: "ai-ml", pandas: "ai-ml",
  claude: "llms", openai: "llms", gemini: "llms", mistral: "llms",
  grok: "llms", ollama: "llms", deepseek: "llms",
  vercel: "devops", github: "tools", cloudflare: "devops",
  supabase: "databases", pinecone: "databases",
  docker: "devops", kubernetes: "devops",
  "react-native": "mobile",
};

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

const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  "ai-ml": "AI / ML",
  llms: "LLMs",
  devops: "DevOps",
  mobile: "Mobile",
  databases: "Databases",
  tools: "Tools",
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
            const category = STACK_CATEGORY[slug] ?? "tools";
            const accentColor = CATEGORY_COLORS[category] ?? "var(--color-brand)";

            return (
              <Link
                key={slug}
                href={`/tech/${slug}`}
                className="group animate-slide-up gradient-border-top card-glow rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5 transition-all"
                style={
                  {
                    "--accent-color": accentColor,
                    animationDelay: i < 20 ? `${i * 50}ms` : undefined,
                  } as React.CSSProperties
                }
                data-category={category}
              >
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)]">
                  {STACK_LABELS[slug]}
                </h2>
                <span
                  className="text-xs mt-0.5 block"
                  style={{ color: accentColor }}
                >
                  {CATEGORY_LABELS[category] ?? category}
                </span>
                <div className="mt-3 flex flex-wrap items-center gap-2">
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
