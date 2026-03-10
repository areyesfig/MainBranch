import type { ReleaseNote } from "@/types/release";
import type { NewsArticle } from "@/types/news";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { sanitizeReleaseText } from "@/lib/utils";

type HeroFeatureProps =
  | { type: "release"; data: ReleaseNote }
  | { type: "news"; data: NewsArticle };

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

export default function HeroFeature(props: HeroFeatureProps) {
  if (props.type === "release") {
    const r = props.data;
    const accentColor = CATEGORY_COLORS[r.category ?? ""] ?? "var(--color-brand)";

    return (
      <Link
        href={`/releases/${r.id}`}
        className="group relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] glass-card p-6 sm:p-8 min-h-[320px] transition-all hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        {/* Accent bar — gradient */}
        <div
          className="absolute top-0 left-0 h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        />
        {/* Category radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at 20% 0%, ${accentColor}, transparent 60%)` }}
          aria-hidden
        />

        <div className="mt-auto">
          {/* Overline */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className="overline"
              style={{ color: accentColor }}
            >
              {r.category?.toUpperCase() ?? "RELEASE"}
            </span>
            {r.breakingChange && (
              <span className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-400">
                <AlertTriangle className="h-3 w-3" />
                BREAKING
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            {r.technology} <span className="text-white/60">v{r.version}</span>
          </h2>

          {/* TLDR */}
          <p className="mt-3 line-clamp-2 text-base text-gray-400 leading-relaxed">
            {sanitizeReleaseText(r.tldr, 160)}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {formatDate(r.releaseDate)}
              {r.impactScore != null && r.impactScore > 0 && (
                <span className="ml-3 text-gray-600">
                  Impact {r.impactScore}
                </span>
              )}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
              Leer más
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // News article
  const a = props.data;
  return (
    <a
      href={a.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] glass-card p-6 sm:p-8 min-h-[320px] transition-all hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <div className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "linear-gradient(90deg, #a855f7, transparent)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 20% 0%, #a855f7, transparent 60%)" }} aria-hidden />

      <div className="mt-auto">
        <span className="overline text-purple-400">NOTICIAS</span>

        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight line-clamp-2">
          {a.titleEs ?? a.title}
        </h2>

        <p className="mt-3 line-clamp-2 text-base text-gray-400 leading-relaxed">
          {a.summaryEs ?? a.summary}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {formatDate(a.publishedAt)}
            <span className="ml-3 text-gray-600">{a.sourceName}</span>
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
            Leer más
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
