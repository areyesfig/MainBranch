"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import NewsCard from "@/components/news/NewsCard";
import TopicFilter from "@/components/news/TopicFilter";
import SearchBar from "@/components/news/SearchBar";
import { getTopicLabel } from "@/lib/topicLabels";
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

interface NewsClientProps {
  initialArticles: NewsArticle[];
}

export default function NewsClient({ initialArticles }: NewsClientProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [lang, setLang] = useState<"en" | "es">("es");

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
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
    }
    return result;
  }, [initialArticles, selectedTopic, searchQuery, sortBy]);

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
      const cards = gridRef.current.children;
      const card = cards[activeIndex] as HTMLElement | undefined;
      card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Noticias AI
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
            Las últimas noticias de inteligencia artificial curadas de los principales medios tech
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Buscar noticias por título, topic, fuente..."
          />
        </div>

        {/* Topic Filter */}
        <div className="mb-8">
          <TopicFilter
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
          />
        </div>

        {/* Sort + Results Count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Mostrando {filteredArticles.length} noticia
            {filteredArticles.length !== 1 ? "s" : ""}
            {selectedTopic && ` • ${getTopicLabel(selectedTopic)}`}
            {searchQuery && ` • búsqueda: "${searchQuery}"`}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Idioma:
              </span>
              <button
                onClick={() => setLang("es")}
                className={`rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === "es"
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === "en"
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                EN
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Ordenar:
              </span>
              <button
                onClick={() => setSortBy("recent")}
                className={`rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors ${
                  sortBy === "recent"
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                Más recientes
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors ${
                  sortBy === "popular"
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                Más populares
              </button>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {filteredArticles.length > 0 ? (
          <div ref={gridRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, i) => (
              <div key={article.id} className="animate-slide-up" style={i < 20 ? { animationDelay: `${i * 50}ms` } : undefined}>
                <NewsCard article={article} lang={lang} isActive={i === activeIndex} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-12 text-center">
            <p className="text-lg text-[var(--color-text-secondary)]">
              No se encontraron noticias para este filtro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
