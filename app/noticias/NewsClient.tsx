"use client";

import { useState, useMemo } from "react";
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

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noticias AI
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredArticles.length} noticia
            {filteredArticles.length !== 1 ? "s" : ""}
            {selectedTopic && ` • ${getTopicLabel(selectedTopic)}`}
            {searchQuery && ` • búsqueda: "${searchQuery}"`}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Idioma:
              </span>
              <button
                onClick={() => setLang("es")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === "es"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === "en"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                EN
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Ordenar:
              </span>
              <button
                onClick={() => setSortBy("recent")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  sortBy === "recent"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                Más recientes
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  sortBy === "popular"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                Más populares
              </button>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No se encontraron noticias para este filtro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
