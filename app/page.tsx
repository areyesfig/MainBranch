export const revalidate = 3600;

import { Container } from "@/components/ds";
import HeroFeature from "@/components/hero/HeroFeature";
import HeroSecondary from "@/components/hero/HeroSecondary";
import NowInTech from "@/components/feed/NowInTech";
import HomeFeed from "@/components/feed/HomeFeed";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { getReleases } from "@/lib/data/releases";
import { getNews } from "@/lib/data/news";
import { isPlaceholderVersion } from "@/lib/utils";
import { Mail } from "lucide-react";

export default async function Home() {
  const [releases, newsArticles] = await Promise.all([getReleases(), getNews()]);
  const withRealVersion = (r: { version?: string }) => !isPlaceholderVersion(r.version);

  const sortedReleases = releases
    .filter(withRealVersion)
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

  // Hero: 1 feature (highest impact or most recent) + 2 secondary
  const highImpactRelease = sortedReleases.find((r) => (r.impactScore ?? 0) >= 70) ?? sortedReleases[0];
  const latestNewsArticle = newsArticles[0];

  // Secondary items: pick next 2 releases or mix with news
  const secondaryItems: Array<
    | { type: "release"; data: (typeof sortedReleases)[0] }
    | { type: "news"; data: (typeof newsArticles)[0] }
  > = [];

  // Add a news item if available
  if (latestNewsArticle && highImpactRelease) {
    secondaryItems.push({ type: "news", data: latestNewsArticle });
    // Add a second release (different from hero)
    const secondRelease = sortedReleases.find((r) => r.id !== highImpactRelease.id);
    if (secondRelease) {
      secondaryItems.push({ type: "release", data: secondRelease });
    }
  } else if (highImpactRelease) {
    // No news, use releases
    const otherReleases = sortedReleases.filter((r) => r.id !== highImpactRelease.id).slice(0, 2);
    for (const r of otherReleases) {
      secondaryItems.push({ type: "release", data: r });
    }
  }

  // Now in tech: 6 most recent
  const nowReleases = sortedReleases.slice(0, 6);

  // Trending: top voted
  const trendingReleases = [...releases]
    .filter(withRealVersion)
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
    .slice(0, 5);

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
    <div className="bg-[var(--color-bg-secondary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section — always dark */}
      <section className="bg-[var(--color-hero-bg)]">
        <Container className="py-10 sm:py-14">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {/* Feature */}
            {highImpactRelease && (
              <HeroFeature type="release" data={highImpactRelease} />
            )}

            {/* Secondary */}
            <HeroSecondary items={secondaryItems} />
          </div>
        </Container>
      </section>

      {/* Now in Tech */}
      {nowReleases.length > 0 && (
        <section className="py-8 sm:py-10">
          <Container>
            <NowInTech releases={nowReleases} />
          </Container>
        </section>
      )}

      {/* Feed with category filter + sidebar */}
      <HomeFeed
        releases={sortedReleases}
        trendingReleases={trendingReleases}
      />

      {/* Newsletter CTA — subtle */}
      <section className="border-t border-[var(--color-border-default)] bg-[var(--color-bg-primary)]">
        <Container size="narrow" className="py-12 sm:py-16 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-[var(--color-text-tertiary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Digest semanal
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Los releases más relevantes directo en tu email, cada semana.
          </p>
          <div className="mx-auto mt-5 max-w-sm">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </div>
  );
}
