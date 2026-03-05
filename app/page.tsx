export const revalidate = 3600;

import Link from "next/link";
import ReleaseCard from "@/components/news/ReleaseCard";
import NewsCard from "@/components/news/NewsCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import FeaturedCard from "@/components/ui/FeaturedCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { getReleases } from "@/lib/data/releases";
import { getNews } from "@/lib/data/news";
import { isPlaceholderVersion } from "@/lib/utils";
import { STACK_LABELS } from "@/lib/stackLabels";
import {
  Database,
  Bot,
  Layers,
  Sparkles,
  Rocket,
  Newspaper,
  TrendingUp,
  Mail,
} from "lucide-react";

export default async function Home() {
  const [releases, newsArticles] = await Promise.all([getReleases(), getNews()]);
  const withRealVersion = (r: { version?: string }) => !isPlaceholderVersion(r.version);

  const sortedReleases = releases
    .filter(withRealVersion)
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

  const latestReleases = sortedReleases.slice(0, 4);
  const latestNews = newsArticles.slice(0, 4);

  const highImpactRelease = sortedReleases.find((r) => (r.impactScore ?? 0) >= 70) ?? sortedReleases[0];
  const latestNewsArticle = newsArticles[0];

  const trendingReleases = [...releases]
    .filter(withRealVersion)
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
    .slice(0, 5);

  const totalReleases = releases.filter(withRealVersion).length;
  const totalNews = newsArticles.length;
  const totalTechs = Object.keys(STACK_LABELS).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Main Branch",
    url: "https://www.mainbranch.cl",
    description:
      "Tu fuente centralizada de noticias, releases y tendencias en tecnología.",
    publisher: {
      "@type": "Organization",
      name: "Main Branch",
      url: "https://www.mainbranch.cl",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.mainbranch.cl/releases?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="animate-fade-in text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
              <Sparkles className="h-4 w-4" />
              Hub de Tecnología
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Main Branch
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Tu fuente centralizada de noticias, releases y tendencias en tecnología.
              Todo lo que necesitas saber del ecosistema dev, en un solo lugar.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/releases"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-600/40"
              >
                <Rocket className="h-5 w-5" />
                Explorar Releases
              </Link>
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <Bot className="h-5 w-5" />
                Noticias AI
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="animate-slide-up animation-delay-200 mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              value={totalReleases}
              label="Releases indexados"
              icon={<Database className="h-5 w-5 text-blue-300" />}
              accentColor="bg-blue-500/20"
            />
            <div className="animation-delay-100">
              <StatCard
                value={totalNews}
                label="Noticias AI"
                icon={<Newspaper className="h-5 w-5 text-purple-300" />}
                accentColor="bg-purple-500/20"
              />
            </div>
            <div className="animation-delay-200">
              <StatCard
                value={totalTechs}
                label="Tecnologías"
                icon={<Layers className="h-5 w-5 text-emerald-300" />}
                accentColor="bg-emerald-500/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destacados */}
      {(highImpactRelease || latestNewsArticle) && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader title="Destacados" subtitle="Lo más relevante de la semana" />
          <div className="grid gap-6 md:grid-cols-2">
            {highImpactRelease && (
              <FeaturedCard type="release" data={highImpactRelease} />
            )}
            {latestNewsArticle && (
              <FeaturedCard type="news" data={latestNewsArticle} />
            )}
          </div>
        </section>
      )}

      {/* Feed a dos columnas */}
      <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Últimos Releases */}
            <div>
              <SectionHeader
                title="Últimos Releases"
                href="/releases"
                linkLabel="Ver todos"
                icon={<Rocket className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              />
              {latestReleases.length > 0 ? (
                <div className="space-y-4">
                  {latestReleases.map((release) => (
                    <ReleaseCard key={release.id} release={release} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay releases disponibles.</p>
              )}
            </div>

            {/* Noticias AI */}
            <div>
              <SectionHeader
                title="Noticias AI"
                href="/noticias"
                linkLabel="Ver todas"
                icon={<Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
              />
              {latestNews.length > 0 ? (
                <div className="space-y-4">
                  {latestNews.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay noticias disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tendencias */}
      {trendingReleases.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            title="Tendencias"
            subtitle="Los releases más votados por la comunidad"
            icon={<TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
          />
          <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {trendingReleases.map((release, i) => (
              <div
                key={release.id}
                className={`animate-slide-up min-w-[300px] flex-shrink-0 animation-delay-${(i + 1) * 100}`}
              >
                <ReleaseCard release={release} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <Mail className="mx-auto mb-4 h-10 w-10 text-white/80" />
          <h2 className="text-3xl font-bold text-white">
            No te pierdas nada
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Recibe un digest semanal con los releases más relevantes y las últimas noticias de AI directo en tu email.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
