"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import NewsCard from "@/components/news/NewsCard";
import TopicFilter from "@/components/news/TopicFilter";
import SearchBar from "@/components/news/SearchBar";
import { getTopicLabel } from "@/lib/topicLabels";
import { formatDate } from "@/lib/utils";
import { TrendingUp, Mail } from "lucide-react";
import type { NewsArticle } from "@/types/news";

function searchInNews(articles: NewsArticle[], query: string): NewsArticle[] {
  if (!query.trim()) return articles;
  const lowerQuery = query.toLowerCase().trim();
  return articles.filter((article) => {
    const searchableText = [
      article.title,
      article.summary,
      article.titleEs,
      article.summaryEs,
      article.sourceName,
      article.topic,
      article.author,
      ...(article.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return searchableText.includes(lowerQuery);
  });
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const TOPIC_BADGE_COLORS: Record<string, string> = {
  openai: "bg-green-500",
  claude: "bg-orange-500",
  gemini: "bg-blue-500",
  deepseek: "bg-purple-500",
  grok: "bg-gray-500",
  mistral: "bg-yellow-500",
  meta: "bg-indigo-500",
  copilot: "bg-gray-600",
  apple: "bg-slate-600",
  nvidia: "bg-green-600",
  "general-ai": "bg-slate-500",
};

interface NewsClientProps {
  initialArticles: NewsArticle[];
}

export default function NewsClient({ initialArticles }: NewsClientProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState<"en" | "es">("es");
  const [showFilters, setShowFilters] = useState(false);

  const topics = useMemo(() => {
    const set = new Set<string>();
    initialArticles.forEach((a) => {
      if (a.topic) set.add(a.topic);
    });
    return Array.from(set).sort();
  }, [initialArticles]);

  const filteredArticles = useMemo(() => {
    let result = searchInNews(initialArticles, searchQuery);
    if (selectedTopic) {
      result = result.filter((a) => a.topic === selectedTopic);
    }
    return result;
  }, [initialArticles, selectedTopic, searchQuery]);

  const heroArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);
  const firstRowArticles = gridArticles.slice(0, 3);
  const secondRowArticles = gridArticles.slice(3, 6);
  const remainingArticles = gridArticles.slice(6);

  // Most read: top 5 by votes (or just first 5 from initial)
  const mostRead = useMemo(() => {
    return [...initialArticles]
      .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
      .slice(0, 5);
  }, [initialArticles]);

  const gridRef = useRef<HTMLDivElement>(null);

  const { activeIndex } = useKeyboardNavigation({
    itemCount: filteredArticles.length,
    onSelect: (index) => {
      const article = filteredArticles[index];
      if (article?.sourceUrl) window.open(article.sourceUrl, "_blank");
    },
  });

  useEffect(() => {
    if (activeIndex >= 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-news-card]");
      const card = cards[activeIndex] as HTMLElement | undefined;
      card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  const getTitle = (a: NewsArticle) =>
    lang === "es" && a.titleEs ? a.titleEs : a.title;
  const getSummary = (a: NewsArticle) =>
    lang === "es" && a.summaryEs ? a.summaryEs : a.summary;
  const getReadTime = (a: NewsArticle) =>
    estimateReadingTime(a.content || a.summary || "");
  const getBadgeColor = (topic?: string) =>
    TOPIC_BADGE_COLORS[topic ?? ""] ?? "bg-slate-500";

  const hasFilters = selectedTopic !== null || searchQuery !== "";

  return (
    <div className="animate-fade-in" ref={gridRef}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Compact toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-[var(--radius-md)] border px-4 py-2 text-sm font-medium transition-colors ${
                showFilters || hasFilters
                  ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                  : "border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              Filtros {hasFilters && `(${filteredArticles.length})`}
            </button>
            <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-0.5">
              <button
                onClick={() => setLang("es")}
                className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === "es"
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === "en"
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                EN
              </button>
            </div>
          </div>
          {hasFilters && (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              {filteredArticles.length} noticia{filteredArticles.length !== 1 ? "s" : ""}
              {selectedTopic && ` · ${getTopicLabel(selectedTopic)}`}
              {searchQuery && ` · "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Collapsible filters */}
        {showFilters && (
          <div className="mb-8 space-y-4 animate-slide-up">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Buscar noticias por título, topic, fuente..."
            />
            <TopicFilter
              topics={topics}
              selectedTopic={selectedTopic}
              onTopicChange={setSelectedTopic}
            />
          </div>
        )}

        {filteredArticles.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-12 text-center">
            <p className="text-lg text-[var(--color-text-secondary)]">
              No se encontraron noticias para este filtro.
            </p>
          </div>
        ) : (
          <>
            {/* Hero Article */}
            {heroArticle && (
              <a
                href={heroArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-news-card
                className="group mb-8 block overflow-hidden rounded-2xl"
              >
                <div className="relative h-[420px] w-full">
                  {heroArticle.imageUrl ? (
                    <img
                      src={heroArticle.imageUrl}
                      alt={getTitle(heroArticle)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    {heroArticle.topic && (
                      <span
                        className={`mb-4 inline-block rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${getBadgeColor(heroArticle.topic)}`}
                      >
                        {getTopicLabel(heroArticle.topic)}
                      </span>
                    )}
                    <h1 className="mb-3 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                      {getTitle(heroArticle)}
                    </h1>
                    <p className="mb-4 max-w-2xl text-sm leading-relaxed text-white/80 line-clamp-2 sm:text-base">
                      {getSummary(heroArticle)}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <time>{formatDate(heroArticle.publishedAt)}</time>
                      {heroArticle.author && (
                        <>
                          <span className="text-white/40">|</span>
                          <span>Por {heroArticle.author}</span>
                        </>
                      )}
                      <span className="text-white/40">|</span>
                      <span>{getReadTime(heroArticle)} min de lectura</span>
                    </div>
                  </div>
                </div>
              </a>
            )}

            {/* First row: 3 cards + Most Read sidebar */}
            {firstRowArticles.length > 0 && (
              <div className="mb-8 grid gap-6 lg:grid-cols-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
                  {firstRowArticles.map((article, i) => (
                    <div key={article.id} data-news-card>
                      <NewsCard
                        article={article}
                        lang={lang}
                        isActive={i + 1 === activeIndex}
                      />
                    </div>
                  ))}
                </div>

                {/* Most Read Sidebar */}
                <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                      Lo más leído
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {mostRead.map((article, i) => (
                      <a
                        key={article.id}
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/item flex items-start gap-3"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-tertiary)] text-xs font-bold text-[var(--color-text-tertiary)]">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-snug text-[var(--color-text-primary)] group-hover/item:text-[var(--color-brand)] line-clamp-2 transition-colors">
                            {getTitle(article)}
                          </p>
                          {article.topic && (
                            <span
                              className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${getBadgeColor(article.topic)}`}
                            >
                              {getTopicLabel(article.topic)}
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Second row: 3 cards + Newsletter sidebar */}
            {secondRowArticles.length > 0 && (
              <div className="mb-8 grid gap-6 lg:grid-cols-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
                  {secondRowArticles.map((article, i) => (
                    <div key={article.id} data-news-card>
                      <NewsCard
                        article={article}
                        lang={lang}
                        isActive={i + 4 === activeIndex}
                      />
                    </div>
                  ))}
                </div>

                {/* Newsletter Sidebar */}
                <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-red-500">🔔</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                      Newsletter
                    </h3>
                  </div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-[var(--color-text-primary)]">
                    Suscríbete a nuestro boletín
                  </h4>
                  <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
                    Recibe las últimas noticias y actualizaciones directamente en tu bandeja de entrada.
                  </p>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="min-w-0 flex-1 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand)]/90"
                    >
                      Suscríbete
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Remaining articles: full-width 3-column grid */}
            {remainingArticles.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {remainingArticles.map((article, i) => (
                  <div key={article.id} data-news-card>
                    <NewsCard
                      article={article}
                      lang={lang}
                      isActive={i + 7 === activeIndex}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
